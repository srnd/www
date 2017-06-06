<?php

namespace StudentRND\Services;

class AwsS3Assets
{
    public static function GetAssets($bucket, $prefix, $thumbPrefix, $downloadPrefix, $downloadExt)
    {
        $thumbsXml = "https://s3-us-west-1.amazonaws.com/${bucket}?prefix=${prefix}/${thumbPrefix}";
        $s3Prefix = "http://${bucket}/${prefix}";

        $thumbsObj = new \SimpleXMLElement(file_get_contents($thumbsXml));
        
        // iterator_to_array doesn't work properly with SimpleXML
        $thumbsArr = [];
        foreach ($thumbsObj->Contents as $c) { $thumbsArr[] = $c; }
        $thumbsArr = array_filter($thumbsArr, function($x) { return $x->Size > 0; });

        // Turn the thumbs into a list of files
        $images = array_map(function($x) use ($s3Prefix, $prefix, $thumbPrefix, $downloadPrefix, $downloadExt) {
            $baseName = basename($x->Key);
            $baseNoExt = substr($baseName, 0, strrpos($baseName, '.'));
            $basePath = substr($x->Key, strlen($thumbPrefix)+strlen($prefix)+2);
            $basePath = substr($basePath, 0, strlen($basePath)-(strlen($baseName)+1));
            return (object)[
                'thumb' => "${s3Prefix}/${thumbPrefix}/${basePath}/${baseName}",
                'download' => "${s3Prefix}/${downloadPrefix}/${basePath}/${baseNoExt}.${downloadExt}",
                'name' => $baseNoExt,
                'folder' => $basePath
            ];
        }, $thumbsArr);

        return self::groupAssets($images);
    }

    protected static function groupAssets($assets)
    {
        $assetsGrouped = [];
        foreach ($assets as $asset) {
            $assetsGrouped[$asset->folder][] = $asset;
        }

        return $assetsGrouped;
    }
}

