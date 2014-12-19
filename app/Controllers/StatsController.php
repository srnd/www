<?php
namespace Www\Controllers;

use \Www\Models;
use \Carbon\Carbon;

class StatsController extends \Controller {
    public function __construct()
    {
        if (\Config::get('app.stats_secret') != \Input::get('secret'))
        {
            \App::abort(401);
        }
    }

    public function getDonationsAmount()
    {
        $campaign_starts_at = strtotime(\Config::get('fundraising.starting'));
        $campaign_ends_at = strtotime(\Config::get('fundraising.by'));
        $donations_campaign = iterator_to_array(Models\Donation
            ::where('created_at', '>', Carbon::createFromTimestamp($campaign_starts_at))
            ->where('created_at', '<', Carbon::createFromTimestamp($campaign_ends_at))
            ->get());

        return json_encode((object)[
            'item' => [
                (object)[
                    'text' => 'Donations Raised',
                    'value' => array_reduce($donations_campaign,
                        function($a, $b) {
                            return (object)['amount' => $a->amount + $b->amount];
                        }, (object)['amount' => 0])->amount,
                    'prefix' => '$'
                ]
            ]
        ]);
    }

    public function getDonorsList()
    {
        $campaign_starts_at = strtotime(\Config::get('fundraising.starting'));
        $campaign_ends_at = strtotime(\Config::get('fundraising.by'));

        if (\Input::get('leaderboard')) {
            $donations_campaign = iterator_to_array(Models\Donation
                ::where('created_at', '>', Carbon::createFromTimestamp($campaign_starts_at))
                ->where('created_at', '<', Carbon::createFromTimestamp($campaign_ends_at))
                ->orderBy('amount', 'DESC')
                ->get());
            return json_encode((object)[
                'items' => array_map(function($a) {
                    return (object)[
                        'label' => $a->display_name,
                        'value' => '$'.number_format($a->amount, 0)
                    ];
                }, $donations_campaign)
            ]);
        } else {
            $donations_campaign = iterator_to_array(Models\Donation
                ::where('created_at', '>', Carbon::createFromTimestamp($campaign_starts_at))
                ->where('created_at', '<', Carbon::createFromTimestamp($campaign_ends_at))
                ->orderBy('created_at', 'DESC')
                ->get());
            return json_encode(array_map(function($a) {
                return (object)[
                    'title' => (object)[
                            'text' => $a->display_name
                        ],
                    'description' => '$'.number_format($a->amount, 0)
                ];
            }, $donations_campaign));
        }
    }

    public function getDonationsBullet()
    {
        $period = in_array(\Input::get('period'), ['day', 'week', 'month', 'year']) ? \Input::get('period') : 'month';
        $period_info = $this->getPeriodInformation($period);


        $campaign_starts_at = strtotime(\Config::get('fundraising.starting'));
        $campaign_ends_at = strtotime(\Config::get('fundraising.by'));
        $campaign_duration = $campaign_ends_at - $campaign_starts_at;
        $campaign_goal = \Config::get('fundraising.amount');
        $campaign_expected_donors = \Config::get('fundraising.expected_quantity');


        $donations_period = iterator_to_array(Models\Donation
            ::where('created_at', '>', $period_info->starts_at)
            ->where('created_at', '<', $period_info->ends_at)
            ->get());
        $donations_campaign = iterator_to_array(Models\Donation
            ::where('created_at', '>', Carbon::createFromTimestamp($campaign_starts_at))
            ->where('created_at', '<', Carbon::createFromTimestamp($campaign_ends_at))
            ->get());

        return json_encode((object)[
            'orientation' => 'vertical',
            'item' => [
                $this->getBulletChartForPeriod(
                    'Revenue ('.ucfirst($period).')',
                    'U.S. $ (1000s)',
                    $period,
                    (($campaign_goal / $campaign_duration) * $period_info->duration)/1000,
                    array_reduce($donations_period,
                        function($a, $b) {
                            return (object)['amount' => $a->amount + $b->amount];
                        }, (object)['amount' => 0])->amount/1000
                ),

                $this->getBulletChartForPeriod(
                    'Count ('.ucfirst($period).')',
                    'Absolute #',
                    $period,
                    $campaign_expected_donors * ($period_info->duration / $campaign_duration),
                    count($donations_period)
                ),


                $this->getBulletChartForPeriod(
                    'Revenue (Campaign)',
                    'U.S. $ (1000s)',
                    $period,
                    $campaign_goal/1000,
                    array_reduce($donations_campaign,
                        function($a, $b) {
                            return (object)['amount' => $a->amount + $b->amount];
                        }, (object)['amount' => 0])->amount/1000
                ),

                $this->getBulletChartForPeriod(
                    'Median (Campaign)',
                    'U.S. $',
                    $period,
                    floor($campaign_goal/$campaign_expected_donors),
                    $this->getMedian(array_map(function ($a) { return $a->amount; }, $donations_campaign)),
                    false
                ),
            ]
        ]);
    }

    private function getBulletChartForPeriod($title, $units, $period,  $goal, $value, $do_forecast = true, $time = null)
    {
        $forecast = $this->getNaiveDeltaForecast($period, $value, $time);
        $max = max($value, $goal, $forecast) * 1.1;

        $round_precision = 0;
        if ($max < 1) {
            $round_precision = 3;
        } elseif ($max < 5) {
            $round_precision = 2;
        } elseif ($max < 10) {
            $round_precision = 1;
        }

        $measure = [
            'current' => (object)[
                    'start' => 0,
                    'end' => $value
                ]
        ];
        if ($do_forecast) {
            $measure['projected'] = (object)[
                'start' => 0,
                'end' => $forecast
            ];
        }

        return (object)[
            'label' => $title,
            'sublabel' => $units,
            'measure' => (object)$measure,
            'comparative' => (object)[
                'point' => $goal
            ],
            'axis' => (object)[
                'point' => [0, round($max/6, $round_precision), round($max/6, $round_precision) * 2,
                            round($max/6, $round_precision) * 3, round($max/6, $round_precision) * 4,
                            round($max/6, $round_precision) * 5, round($max/6, $round_precision) * 6]
            ],
            'range' => (object)[
                'red' => (object)[
                    'start' => 0,
                    'end' => round($max/3, $round_precision)
                ],
                'amber' => (object)[
                    'start' => round($max/3, $round_precision),
                    'end' => round($max/3, $round_precision) * 2
                ],
                'green' => (object)[
                    'start' => round($max/3, $round_precision) * 2,
                    'end' => $max
                ]
            ]
        ];
    }

    /**
     * Gets a linear forecast for the value of a quantity at the end of this period.
     *
     * @param $period   string  The name of the period to forecast (day, week, month, or year)
     * @param $value    int     The quantity earned in this period (the delta since last period)
     * @param $time     int     The timestamp of the current data (null for current time)
     */
    private function getNaiveDeltaForecast($period, $value, $time = null)
    {
        $period_info = $this->getPeriodInformation($period, $time);
        return (1/$period_info->percent_complete) * $value;
    }

    /**
     * Gets information about the period
     *
     * @param $period The name of the period (day, week, month, or year)
     * @param $time   The timestamp to get period information for (null for current time)
     * @return object An object containing starts_at, ends_at, duration, and percent_complete
     */
    private function getPeriodInformation($period, $time = null)
    {
        if (!$time) {
            $time = time();
        }

        $starts_at = Carbon::createFromTimestamp([
            'day' => strtotime(date('Y-m-d', $time)),
            'week' => strtotime('this week', $time),
            'month' => strtotime(date('Y-m-1', $time)),
            'year' => strtotime(date('Y-1-1', $time))
        ][$period]);

        $ends_at = [
            'day' => $starts_at->copy()->addDay(),
            'week' => $starts_at->copy()->addWeek(),
            'month' => $starts_at->copy()->addMonth(),
            'year' => $starts_at->copy()->addYear()
        ][$period];

        $duration = $ends_at->timestamp - $starts_at->timestamp;
        $current_delta = $time - $starts_at->timestamp;
        $current_percent = $current_delta/$duration;

        return (object)[
            'starts_at' => $starts_at,
            'ends_at' => $ends_at,
            'duration' => $duration,
            'percent_complete' => $current_percent
        ];
    }

    private function getMedian($array) {
        if (count($array) === 0) {
            return 0;
        }

        $middle_index = floor(count($array) / 2);
        sort($array, SORT_NUMERIC);
        $median = $array[$middle_index];

        // If array is even, average the two middle elements
        if (count($array) % 2 == 0) {
            $median = ($median + $array[$middle_index - 1]) / 2;
        }
        return $median;
    }
} 