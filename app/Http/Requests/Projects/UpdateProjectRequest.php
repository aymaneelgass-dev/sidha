<?php
namespace App\Http\Requests\Projects;
use App\Models\Project;
class UpdateProjectRequest extends StoreProjectRequest {
 public function authorize(): bool {
  $project=$this->route('project');
  return $project instanceof Project && ($this->user()?->can('update',$project) ?? false);
 }
}
