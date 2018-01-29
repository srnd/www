<?php

namespace StudentRND\Http\Controllers;

class OpenController extends \StudentRND\Http\Controller
{
    private function gh_get($endpoint)
    {
        $url = 'https://api.github.com/'.$endpoint;

        $options = ['http' => ['user_agent'=> $_SERVER['HTTP_USER_AGENT']]];
        $context = stream_context_create($options);
        $result = @json_decode(@file_get_contents($url, false, $context));
        if (!$result) {
            return [];
        } else {
            return $result;
        }
    }

    public function getIndex()
    {
        $gh_contents = $this->gh_get('repos/StudentRND/BoardOfDirectors/contents/');

        $real_files = [];
        $wc_files = [];

        foreach ($gh_contents as $file) {
            if ($file->type === 'file'
                && preg_match('/\d{4}\-\d{2}\-\d{2}\.markdown/', $file->name)) {
                list($name, $ext) = explode('.', $file->name);
                $real_files[] = (object) [
                    'name' => $name,
                    'date' => strtotime($name),
                ];
            } elseif ($file->type === 'file'
                && preg_match('/wc-\d{4}\-\d{2}\-\d{2}(-\d{1,2})?\.pdf/', $file->name)) {
                list($name, $ext) = explode('.', $file->name);
                $name = substr($name, 3);
                $display = substr($name, 0, 10);
                $number = null;
                if ($display !== $name) {
                    $number = substr($name, 11);
                }
                $wc_files[] = (object) [
                    'name'    => $name,
                    'display' => $display,
                    'date'    => strtotime($display),
                    'number'  => $number,
                ];
            }
        }

        usort($real_files, function ($a, $b) {
            return $b->date - $a->date;
        });

        usort($wc_files, function ($a, $b) {
            if ($a->date == $b->date) {
                return $b->number - $a->number;
            } else {
                return $b->date - $a->date;
            }
        });

        return \View::make('pages/open/index', ['minutes' => $real_files, 'written' => $wc_files]);
    }

    public function getWc($for)
    {
        if (!preg_match('/^\d{4}\-\d{2}\-\d{2}(-\d{1,2})?/', $for)) {
            \App::abort(404);
        }

        try {
            $gh_contents = $this->gh_get('repos/StudentRND/BoardOfDirectors/contents/wc-'.$for.'.pdf');
        } catch (\Exception $ex) {
            \App::abort(404);
        }

        if (!$gh_contents) {
            \App::abort(404);
        }

        $content = base64_decode($gh_contents->content);
        header('Content-type: application/pdf');
        echo $content;
    }

    public function getMinutes($for)
    {
        if (!preg_match('/^\d{4}\-\d{2}\-\d{2}$/', $for)) {
            \App::abort(404);
        }

        try {
            $gh_contents = $this->gh_get('repos/StudentRND/BoardOfDirectors/contents/'.$for.'.markdown');
        } catch (\Exception $ex) {
            \App::abort(404);
        }

        if (!$gh_contents) {
            \App::abort(404);
        }

        $date = strtotime($for);
        $content = base64_decode($gh_contents->content);

        $minutes_file = (object) [
            'date'    => $date,
            'name'    => $for,
            'content' => $content,
        ];

        return \View::make('pages/open/minutes', ['minutes_file' => $minutes_file]);
    }
}
