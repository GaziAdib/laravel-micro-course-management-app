import { useState } from 'react';
import { router, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from "sonner";
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Question {
    id: number;
    quiz_id: number;
    question_text: string;
    options: {
        choices: {
            key: string;
            text: string;
        }[];
    };
    correct_answer: string;
    points: number;
}

interface Quiz {
    id: number;
    title: string;
}

interface PaginatedData {
    data: Question[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

interface QuestionsPageProps {
    questions: PaginatedData;
    quizzess: Quiz[];
}

interface QuestionFormData {
    quiz_id: number | string;
    question_text: string;
    options: {
        choices: {
            key: string;
            text: string;
        }[];
    };
    correct_answer: string;
    points: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Questions',
        href: '/admin/questions',
    },
];

export default function QuestionsPage({ questions, quizzess }: QuestionsPageProps) {
    const [showModal, setShowModal] = useState(false);
    const [editQuestion, setEditQuestion] = useState<Question | null>(null);
    const [formData, setFormData] = useState<QuestionFormData>({
        quiz_id: '',
        question_text: '',
        options: {
            choices: [
                { key: 'a', text: '' },
                { key: 'b', text: '' }
            ]
        },
        correct_answer: '',
        points: 1
    });

    const handleAdd = () => {
        setEditQuestion(null);
        setFormData({
            quiz_id: '',
            question_text: '',
            options: {
                choices: [
                    { key: 'a', text: '' },
                    { key: 'b', text: '' }
                ]
            },
            correct_answer: '',
            points: 1
        });
        setShowModal(true);
    };

    const handleEdit = (question: Question) => {
        setEditQuestion(question);
        setFormData({
            quiz_id: question.quiz_id,
            question_text: question.question_text,
            options: question.options,
            correct_answer: question.correct_answer,
            points: question.points
        });
        setShowModal(true);
    };

    const handleDelete = (id: number, quizId: number) => {
        if (confirm('Are you sure you want to delete this question?')) {
            router.delete(`/admin/${quizId}/delete-question/${id}`, {
                onSuccess: () => {
                    toast.success('Question deleted successfully');
                },
                onError: (errors) => {
                    toast.error(errors.error || 'Failed to delete question');
                },
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            ...formData,
            quiz_id: Number(formData.quiz_id),
            points: Number(formData.points)
        };

        if (editQuestion) {
            router.put(`/admin/${editQuestion.quiz_id}/update-question/${editQuestion.id}`, payload, {
                onSuccess: () => {
                    setShowModal(false);
                    toast.success('Question updated successfully');
                },
                onError: (errors) => {
                    console.log('error', errors);
                    toast.error(errors.error || 'Failed to update question');
                },
            });
        } else {
            router.post(`/admin/${formData.quiz_id}/add-question`, payload, {
                onSuccess: () => {
                    setShowModal(false);
                    toast.success('Question created successfully');
                },
                onError: (errors) => {
                    toast.error(errors.error || 'Failed to create question');
                },
            });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleChoiceChange = (index: number, value: string) => {
        const newChoices = [...formData.options.choices];
        newChoices[index] = {
            ...newChoices[index],
            text: value
        };
        setFormData(prev => ({
            ...prev,
            options: { choices: newChoices }
        }));
    };

    const addChoice = () => {
        const newKey = String.fromCharCode(97 + formData.options.choices.length);
        setFormData(prev => ({
            ...prev,
            options: {
                choices: [
                    ...prev.options.choices,
                    { key: newKey, text: '' }
                ]
            }
        }));
    };

    const removeChoice = (index: number) => {
        if (formData.options.choices.length <= 2) {
            toast.error('At least two choices are required');
            return;
        }

        const newChoices = formData.options.choices.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            options: { choices: newChoices }
        }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Questions" />
            <Toaster richColors closeButton position="top-right" />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Questions</h1>
                    <Button onClick={handleAdd}>
                        Add Question
                    </Button>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Question</TableHead>
                                <TableHead>Quiz</TableHead>
                                <TableHead>Points</TableHead>
                                <TableHead>Correct Answer</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {questions?.data?.map((question) => (
                                <TableRow key={question.id}>
                                    <TableCell>{question.question_text}</TableCell>
                                    <TableCell>{question.quiz?.title}</TableCell>
                                    <TableCell>{question.points}</TableCell>
                                    <TableCell>{question.correct_answer}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(question)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(question.id, question.quiz_id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Add/Edit Question Modal */}
                <Dialog open={showModal} onOpenChange={setShowModal}>
                    <DialogContent className="sm:max-w-[625px]">
                        <DialogHeader>
                            <DialogTitle>
                                {editQuestion ? 'Edit Question' : 'Add Question'}
                            </DialogTitle>
                            <DialogDescription>
                                {editQuestion ? 'Make changes to your question here.' : 'Create a new question here.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="quiz_id">Quiz</Label>
                                <Select
                                    value={formData.quiz_id.toString()}
                                    onValueChange={(value) => setFormData(prev => ({
                                        ...prev,
                                        quiz_id: value
                                    }))}
                                    required
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select quiz" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {quizzess?.data?.map((quiz) => (
                                            <SelectItem
                                                key={quiz.id}
                                                value={quiz.id.toString()}
                                            >
                                                {quiz.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="question_text">Question Text</Label>
                                <Textarea
                                    id="question_text"
                                    name="question_text"
                                    value={formData.question_text}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Options</Label>
                                {formData.options.choices.map((choice, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <span className="w-6 font-medium">{choice.key}.</span>
                                        <Input
                                            value={choice.text}
                                            onChange={(e) => handleChoiceChange(index, e.target.value)}
                                            placeholder={`Option ${choice.key}`}
                                            required
                                        />
                                        {formData.options.choices.length > 2 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeChoice(index)}
                                            >
                                                Remove
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addChoice}
                                    disabled={formData.options.choices.length >= 5}
                                >
                                    Add Option
                                </Button>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="correct_answer">Correct Answer Key</Label>
                                <Input
                                    id="correct_answer"
                                    name="correct_answer"
                                    value={formData.correct_answer}
                                    onChange={handleInputChange}
                                    placeholder="Enter correct answer key (a, b, c, etc.)"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="points">Points</Label>
                                <Input
                                    id="points"
                                    type="number"
                                    name="points"
                                    min={1}
                                    value={formData.points}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {editQuestion ? 'Update' : 'Create'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}




























// import { useState } from 'react';
// import { router, Head } from '@inertiajs/react';
// import AppLayout from '@/layouts/app-layout';
// import { type BreadcrumbItem } from '@/types';
// import { Button } from "@/components/ui/button";
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table";
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogFooter,
//     DialogDescription,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { toast, Toaster } from "sonner";
// import { Textarea } from '@/components/ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// interface Question {
//     id: number;
//     quiz_id: number;
//     question_text: string;
//     options: {
//         choices: {
//             key: string;
//             text: string;
//             is_correct: boolean;
//         }[];
//     };
//     correct_answer: string;
//     points: number;
// }

// interface Quiz {
//     id: number;
//     title: string;
// }

// interface PaginatedData {
//     data: Question[];
//     current_page: number;
//     last_page: number;
//     per_page: number;
//     total: number;
//     links: {
//         url: string | null;
//         label: string;
//         active: boolean;
//     }[];
// }

// interface QuestionsPageProps {
//     questions: PaginatedData;
//     quizzess: Quiz[];
// }

// interface QuestionFormData {
//     quiz_id: number | string;
//     question_text: string;
//     options: {
//         choices: {
//             key: string;
//             text: string;
//             is_correct: boolean;
//         }[];
//     };
//     correct_answer: string;
//     points: number;
// }

// const breadcrumbs: BreadcrumbItem[] = [
//     {
//         title: 'Questions',
//         href: '/admin/questions',
//     },
// ];

// export default function QuestionsPage({ questions, quizzess }: QuestionsPageProps) {
//     const [showModal, setShowModal] = useState(false);
//     const [editQuestion, setEditQuestion] = useState<Question | null>(null);
//     const [formData, setFormData] = useState<QuestionFormData>({
//         quiz_id: '',
//         question_text: '',
//         options: {
//             choices: [
//                 { key: 'a', text: '', is_correct: false },
//                 { key: 'b', text: '', is_correct: false }
//             ]
//         },
//         correct_answer: '',
//         points: 1
//     });


//     console.log('quizes', quizzess);


//     const handleAdd = () => {
//         setEditQuestion(null);
//         setFormData({
//             quiz_id: '',
//             question_text: '',
//             options: {
//                 choices: [
//                     { key: 'a', text: '', is_correct: false },
//                     { key: 'b', text: '', is_correct: false }
//                 ]
//             },
//             correct_answer: '',
//             points: 1
//         });
//         setShowModal(true);
//     };

//     const handleEdit = (question: Question) => {
//         setEditQuestion(question);
//         setFormData({
//             quiz_id: question.quiz_id,
//             question_text: question.question_text,
//             options: question.options,
//             correct_answer: question.correct_answer,
//             points: question.points
//         });
//         setShowModal(true);
//     };

//     const handleDelete = (id: number) => {
//         if (confirm('Are you sure you want to delete this question?')) {
//             router.delete(`/admin/questions/${id}`, {
//                 onSuccess: () => {
//                     toast.success('Question deleted successfully');
//                 },
//                 onError: (errors) => {
//                     toast.error(errors.error || 'Failed to delete question');
//                 },
//             });
//         }
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();

//         const payload = {
//             ...formData,
//             quiz_id: Number(formData.quiz_id),
//             points: Number(formData.points)
//         };

//         if (editQuestion) {
//             router.put(`/admin/${editQuestion.quiz_id}/update-question/${editQuestion.id}`, payload, {
//                 onSuccess: () => {
//                     setShowModal(false);
//                     toast.success('Question updated successfully');
//                 },
//                 onError: (errors) => {
//                     console.log(errors);
//                     toast.error(errors.error || 'Failed to update question');
//                 },
//             });
//         } else {
//             router.post(`/admin/${formData.quiz_id}/add-question`, payload, {
//                 onSuccess: () => {
//                     setShowModal(false);
//                     toast.success('Question created successfully');
//                 },
//                 onError: (errors) => {
//                     console.log('error', errors);
//                     toast.error(errors.error || 'Failed to create question');
//                 },
//             });
//         }
//     };

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const handleChoiceChange = (index: number, field: string, value: string | boolean) => {
//         const newChoices = [...formData.options.choices];
//         newChoices[index] = {
//             ...newChoices[index],
//             [field]: value
//         };

//         // If setting is_correct to true, update correct_answer
//         if (field === 'is_correct' && value === true) {
//             setFormData(prev => ({
//                 ...prev,
//                 options: { choices: newChoices },
//                 correct_answer: newChoices[index].key
//             }));
//         } else {
//             setFormData(prev => ({
//                 ...prev,
//                 options: { choices: newChoices }
//             }));
//         }
//     };

//     const addChoice = () => {
//         const newKey = String.fromCharCode(97 + formData.options.choices.length); // a, b, c, etc.
//         setFormData(prev => ({
//             ...prev,
//             options: {
//                 choices: [
//                     ...prev.options.choices,
//                     { key: newKey, text: '', is_correct: false }
//                 ]
//             }
//         }));
//     };

//     const removeChoice = (index: number) => {
//         if (formData.options.choices.length <= 2) {
//             toast.error('At least two choices are required');
//             return;
//         }

//         const newChoices = formData.options.choices.filter((_, i) => i !== index);
//         setFormData(prev => ({
//             ...prev,
//             options: { choices: newChoices },
//             // Reset correct_answer if we removed the correct choice
//             correct_answer: prev.correct_answer === prev.options.choices[index].key ? '' : prev.correct_answer
//         }));
//     };

//     const handlePageChange = (page: number) => {
//         router.get(route('admin.questions.index'), { page }, {
//             preserveState: true,
//             preserveScroll: true,
//         });
//     };

//     return (
//         <AppLayout breadcrumbs={breadcrumbs}>
//             <Head title="Questions" />
//             <Toaster richColors closeButton position="top-right" />

//             <div className="flex flex-col gap-4 p-4">
//                 <div className="flex justify-between items-center mb-4">
//                     <h1 className="text-2xl font-bold">Questions</h1>
//                     <Button onClick={handleAdd}>
//                         Add Question
//                     </Button>
//                 </div>

//                 <div className="rounded-md border">
//                     <Table>
//                         <TableHeader>
//                             <TableRow>
//                                 <TableHead>Question</TableHead>
//                                 <TableHead>Quiz</TableHead>
//                                 <TableHead>Points</TableHead>
//                                 <TableHead>Correct Answer</TableHead>
//                                 <TableHead>Actions</TableHead>
//                             </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                             {questions?.data?.map((question) => (
//                                 <TableRow key={question.id}>
//                                     <TableCell className="max-w-xs truncate">{question.question_text}</TableCell>
//                                     <TableCell>{question.quiz?.title}</TableCell>
//                                     <TableCell>{question.points}</TableCell>
//                                     <TableCell>{question.correct_answer}</TableCell>
//                                     <TableCell>
//                                         <div className="flex gap-2">
//                                             <Button
//                                                 variant="outline"
//                                                 size="sm"
//                                                 onClick={() => handleEdit(question)}
//                                             >
//                                                 Edit
//                                             </Button>
//                                             <Button
//                                                 variant="destructive"
//                                                 size="sm"
//                                                 onClick={() => handleDelete(question.id)}
//                                             >
//                                                 Delete
//                                             </Button>
//                                         </div>
//                                     </TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </div>

//                 {/* Pagination */}
//                 <div className="flex justify-start mt-4">
//                     <nav className="flex items-center space-x-2">
//                         <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => handlePageChange(questions?.current_page - 1)}
//                             disabled={questions?.current_page === 1}
//                             className="h-8 px-2"
//                         >
//                             Previous
//                         </Button>
//                         <div className="flex items-center space-x-1">
//                             {questions?.links.map((link, i) => {
//                                 if (link.label === '...') {
//                                     return (
//                                         <span key={i} className="px-2">...</span>
//                                     );
//                                 }

//                                 if (link.url === null) {
//                                     return null;
//                                 }

//                                 const page = parseInt(link.label);
//                                 return (
//                                     <Button
//                                         key={i}
//                                         variant={link.active ? "default" : "outline"}
//                                         size="sm"
//                                         onClick={() => handlePageChange(page)}
//                                         className="h-8 w-8 p-0"
//                                     >
//                                         {link.label}
//                                     </Button>
//                                 );
//                             })}
//                         </div>
//                         <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => handlePageChange(questions?.current_page + 1)}
//                             disabled={questions?.current_page === questions?.last_page}
//                             className="h-8 px-2"
//                         >
//                             Next
//                         </Button>
//                     </nav>
//                 </div>

//                 {/* Add/Edit Question Modal */}
//                 <Dialog open={showModal} onOpenChange={setShowModal}>
//                     <DialogContent className="sm:max-w-[625px]">
//                         <DialogHeader>
//                             <DialogTitle>
//                                 {editQuestion ? 'Edit Question' : 'Add Question'}
//                             </DialogTitle>
//                             <DialogDescription>
//                                 {editQuestion ? 'Make changes to your question here.' : 'Create a new question here.'}
//                             </DialogDescription>
//                         </DialogHeader>
//                         <form onSubmit={handleSubmit} className="space-y-4">
//                             <div className="space-y-2">
//                                 <Label htmlFor="quiz_id">Quiz</Label>
//                                 <Select
//                                     value={formData.quiz_id.toString()}
//                                     onValueChange={(value) => setFormData(prev => ({
//                                         ...prev,
//                                         quiz_id: value
//                                     }))}
//                                     required
//                                 >
//                                     <SelectTrigger className="w-full">
//                                         <SelectValue placeholder="Select quiz" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         {quizzess?.data?.map((quiz) => (
//                                             <SelectItem
//                                                 key={quiz.id}
//                                                 value={quiz.id.toString()}
//                                             >
//                                                 {quiz.title}
//                                             </SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>
//                             </div>

//                             <div className="space-y-2">
//                                 <Label htmlFor="question_text">Question Text</Label>
//                                 <Textarea
//                                     id="question_text"
//                                     name="question_text"
//                                     value={formData.question_text}
//                                     onChange={handleInputChange}
//                                     required
//                                 />
//                             </div>

//                             <div className="space-y-2">
//                                 <Label>Choices</Label>
//                                 <div className="space-y-3">
//                                     {formData.options.choices.map((choice, index) => (
//                                         <div key={index} className="flex items-center gap-3">
//                                             <div className="flex items-center gap-2 flex-1">
//                                                 <span className="w-6 font-medium">{choice.key}.</span>
//                                                 <Input
//                                                     value={choice.text}
//                                                     onChange={(e) => handleChoiceChange(index, 'text', e.target.value)}
//                                                     placeholder="Enter choice text"
//                                                     required
//                                                 />
//                                             </div>
//                                             <div className="flex items-center gap-2">
//                                                 <input
//                                                     type="radio"
//                                                     name="correct_answer"
//                                                     checked={choice.is_correct}
//                                                     onChange={() => handleChoiceChange(index, 'is_correct', true)}
//                                                     className="h-4 w-4"
//                                                 />
//                                                 <Button
//                                                     type="button"
//                                                     variant="ghost"
//                                                     size="sm"
//                                                     onClick={() => removeChoice(index)}
//                                                     disabled={formData.options.choices.length <= 2}
//                                                 >
//                                                     Remove
//                                                 </Button>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                                 <Button
//                                     type="button"
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={addChoice}
//                                     disabled={formData.options.choices.length >= 5}
//                                 >
//                                     Add Choice
//                                 </Button>
//                             </div>

//                              <div className="space-y-2">
//                                 <Label htmlFor="points">Correct Answer</Label>
//                                 <Input
//                                     id="correct_answer"
//                                     type="text"
//                                     name="correct_answer"
//                                     value={formData.correct_answer}
//                                     onChange={handleInputChange}
//                                     required
//                                 />
//                             </div>

//                             <div className="space-y-2">
//                                 <Label htmlFor="points">Points</Label>
//                                 <Input
//                                     id="points"
//                                     type="number"
//                                     name="points"
//                                     min={1}
//                                     max={100}
//                                     value={formData.points}
//                                     onChange={handleInputChange}
//                                     required
//                                 />
//                             </div>

//                             <DialogFooter>
//                                 <Button
//                                     type="button"
//                                     variant="outline"
//                                     onClick={() => setShowModal(false)}
//                                 >
//                                     Cancel
//                                 </Button>
//                                 <Button type="submit">
//                                     {editQuestion ? 'Update' : 'Create'}
//                                 </Button>
//                             </DialogFooter>
//                         </form>
//                     </DialogContent>
//                 </Dialog>
//             </div>
//         </AppLayout>
//     );
// }
