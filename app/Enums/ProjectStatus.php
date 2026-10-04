<?php

namespace App\Enums;

enum ProjectStatus: string
{
    case Brief = 'brief';
    case PreProduction = 'pre-production';
    case Production = 'production';
    case PostProduction = 'post-production';
    case Validation = 'validation';
    case Delivered = 'delivered';
    case Archived = 'archived';
}
