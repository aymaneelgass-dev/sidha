export type ProductionPlan = {
    id: number;
    provider: string;
    model: string;
    generated_at: string;
    updated_at: string;
    content: {
        objective: string;
        creative_concept: string;
        script: string;
        shot_list: {
            number: number;
            description: string;
            framing: string;
            notes: string;
        }[];
        voice_over: { required: boolean; text: string | null; notes: string };
        production_checklist: { category: string; task: string }[];
    };
};
