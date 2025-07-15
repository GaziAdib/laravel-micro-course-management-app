import { useState } from 'react';
import { Clock, ChevronDown, ChevronRight, CheckCircle2, PlayCircle } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Lesson {
    id: number;
    title: string;
    duration: string;
    order: number;
    is_current?: boolean;
}

interface Module {
    id: number;
    title: string;
    description?: string;
    order: number;
    lessons: Lesson[];
}

interface ModuleListProps {
    modules: Module[];
    onLessonSelect?: (lessonId: number) => void;
}

export default function ModuleList({ modules, onLessonSelect }: ModuleListProps) {
    const [expandedModules, setExpandedModules] = useState<number[]>([]);

    const toggleModule = (moduleId: number) => {
        setExpandedModules(prev =>
            prev.includes(moduleId)
                ? prev.filter(id => id !== moduleId)
                : [...prev, moduleId]
        );
    };

    if (!modules || modules.length === 0) {
        return (
            <Card className="text-center py-8">
                <CardContent>
                    <p className="text-muted-foreground">No modules available for this course yet.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-2">
            {modules.map((module) => (
                <Card key={module.id} className="overflow-hidden">
                    <CardHeader
                        className="px-2 hover:bg-accent/50 cursor-pointer transition-colors"
                        onClick={() => toggleModule(module.id)}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                {expandedModules.includes(module.id) ? (
                                    <ChevronDown className="h-5 w-5 text-primary" />
                                ) : (
                                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                )}
                                <CardTitle className="text-lg font-medium">
                                    {module.title}
                                </CardTitle>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Badge variant="outline">
                                    {module.lessons.length} lessons
                                </Badge>

                            </div>
                        </div>
                        {module.description && (
                            <CardDescription className="pl-8 pt-1">
                                {module.description}
                            </CardDescription>
                        )}

                    </CardHeader>

                    {expandedModules.includes(module.id) && (
                        <CardContent className="p-0 border-t">
                            <div className="divide-y">
                                {module.lessons.map((lesson) => (
                                    <div
                                        key={lesson.id}
                                        className={`flex items-center p-4 hover:bg-accent/50 transition-colors ${lesson.is_current ? 'bg-accent' : ''}`}
                                        onClick={() => onLessonSelect?.(lesson.id)}
                                    >
                                        {/* <div className="flex-shrink-0 mr-4">
                                            {lesson.is_completed ? (
                                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                            ) : (
                                                <PlayCircle className="h-5 w-5 text-primary" />
                                            )}
                                        </div> */}
                                       <div className="flex-shrink-0 w-8 mr-3 text-center">

                                                <span className="text-sm font-medium rounded-full border-gray-600 border-2 px-1.5">{lesson.order}</span>

                                        </div>
                                        <div className="flex-grow">
                                            <p className={`font-medium`}>
                                                {lesson.title}
                                            </p>
                                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                                                <Clock className="h-4 w-4 mr-1" />
                                                <span>{lesson.duration}</span>
                                            </div>
                                        </div>
                                        {lesson.is_current && (
                                            <Badge variant="default" className="ml-2">
                                                Current
                                            </Badge>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    )}
                </Card>
            ))}
        </div>
    );
}










// import { Clock } from 'lucide-react';


// interface Lesson {
//     id: number;
//     title: string;
//     duration: string;
// }


// interface Module {
//     id: number;
//     title: string;
//     description: string;
//     lessons: Lesson[]
// }

// interface ModuleListProps {
//     modules: Module[]
// }

// export default function ModuleList({ modules }: ModuleListProps) {
//     if (!modules || modules.length === 0) {
//         return (
//             <div className={`text-center py-8 text-muted-foreground`}>
//                 <p>No modules available for this course yet.</p>
//             </div>
//         );
//     }

//     return (
//         <div className={`space-y-4`}>
//             {modules.map((module) => (
//                 <div
//                     key={module.id}
//                     className="border rounded-lg overflow-hidden bg-card transition-all hover:shadow-md"
//                 >
//                     <div className="p-4">
//                         <h3 className="font-semibold text-lg flex items-center">
//                             <span className="mr-2">📚</span>
//                             {module.title}
//                         </h3>

//                         {module.description && (
//                             <p className="text-sm text-muted-foreground mt-1">
//                                 {module.description}
//                             </p>
//                         )}

//                         <div className="mt-3 space-y-2">
//                             {module?.lessons?.map((lesson) => (
//                                 <div
//                                     key={lesson.id}
//                                     className="flex items-center p-2 rounded hover:bg-muted/50 transition-colors"
//                                 >

//                                     <div className="flex-grow">
//                                         <p className="font-medium">{lesson.title}</p>
//                                         {lesson.duration && (
//                                             <p className="text-xs text-muted-foreground">
//                                                 Duration: {lesson.duration}
//                                             </p>
//                                         )}
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
// }
