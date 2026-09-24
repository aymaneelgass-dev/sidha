<?php
namespace App\Http\Requests\Projects;
use App\Enums\{ProjectStatus,ProjectType};
use App\Models\Project;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Database\Query\Builder;
class StoreProjectRequest extends FormRequest {
 public function authorize(): bool { return $this->user()?->can('create',Project::class) ?? false; }
 /** @return array<string,list<mixed>> */
 public function rules(): array {
  $project=$this->route('project');
  $existingClient=$project instanceof Project ? $project->client_id : null;
  return [
   'name'=>['required','string','max:150'],
   'client_id'=>['required','integer',Rule::exists('clients','id')->where(function(Builder $query) use ($existingClient): void {
    $query->where(function(Builder $query) use ($existingClient): void {
     $query->where('status','!=','archived');
     if ($existingClient !== null) { $query->orWhere('id',$existingClient); }
    });
   })],
   'type'=>['required',Rule::enum(ProjectType::class)],
   'status'=>['required',Rule::enum(ProjectStatus::class)],
   'budget'=>['required','numeric','min:0','max:9999999999.99','regex:/^\\d{1,10}(\\.\\d{1,2})?$/'],
   'start_date'=>['nullable','date_format:Y-m-d'],
   'deadline'=>['nullable','date_format:Y-m-d',...($this->filled('start_date') ? ['after_or_equal:start_date'] : [])],
   'brief'=>['nullable','string','max:10000'],
  ];
 }
}
