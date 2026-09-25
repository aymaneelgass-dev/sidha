import { Form } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { archive } from '@/routes/projects';
import type { Project } from '@/types/project';
export function ProjectArchiveDialog({ project }: { project: Project }) {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Archive</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Archive project?</DialogTitle>
                    <DialogDescription className="break-words">
                        {project.reference} — {project.name} will remain
                        available, including its expenses. You can restore a
                        production stage by editing the project.
                    </DialogDescription>
                </DialogHeader>
                <Form
                    {...archive.form(project.id)}
                    onSuccess={() => {
                        setOpen(false);
                        requestAnimationFrame(() =>
                            document.getElementById('project-title')?.focus(),
                        );
                    }}
                    disableWhileProcessing
                >
                    {({ processing }) => (
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={processing}
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={processing}>
                                Archive project
                            </Button>
                        </DialogFooter>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
