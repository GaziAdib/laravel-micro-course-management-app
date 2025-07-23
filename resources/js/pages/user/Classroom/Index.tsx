import { useState, useEffect } from 'react'
import ReactPlayer from 'react-player'
import { ChevronDown, ChevronRight, Clock, Play, BookOpen, ListVideo } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { usePage } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { QuizContainer } from '../../../components/quiz/QuizContainer';

interface Lesson {
    id: string
    title: string
    duration: string
    video_url: string
    thumbnail_url: string
    order: number
}

interface Quiz {
    id: string
    title: string
    description: string
    questions: Array<{
        id: string
        question_text: string
        options: {
            choices: Array<{
                key: string
                text: string
            }>
        }
        correct_answer: string
        points: number
    }>
    passing_score: number
    max_attempts: number
    max_time_limit: number
}

interface Module {
    id: string
    title: string
    order: number
    is_paid: boolean
    lessons: Lesson[]
    quiz?: Quiz
}

interface Course {
    id: string
    title: string
    description: string
    modules: Module[]
}

export default function ClassroomPage() {
    const { course: initialCourseData, canViewFreeModule, hasPurchased } = usePage<{ course: Course }>().props
    const { auth } = usePage().props

    const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
    const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null)
    const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({})
    const [quizAttempts, setQuizAttempts] = useState(0)

    // Initialize first lesson and expand first module
    useEffect(() => {
        if (initialCourseData?.modules?.length > 0 && initialCourseData.modules[0].lessons?.length > 0) {
            setActiveLesson(initialCourseData.modules[0].lessons[0])
            setExpandedModules({ [initialCourseData.modules[0].id]: true })
        }
    }, [initialCourseData])

    const toggleModule = (moduleId: string) => {
        setExpandedModules(prev => ({
            ...prev,
            [moduleId]: !prev[moduleId]
        }))
    }

    const startQuiz = (quiz: Quiz) => {
        setActiveQuiz(quiz)
        setActiveLesson(null)
        setQuizAttempts(prev => prev + 1)
    }

    const handleQuizComplete = () => {
        setActiveQuiz(null)
    }

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] gap-4 p-4 bg-background">
            {/* Left Content Area */}
            <div className="w-full lg:w-2/3 h-full flex flex-col gap-4">
                <Card className="flex-1">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-xl font-semibold text-foreground">
                            {activeQuiz
                                ? `Quiz: ${activeQuiz.title}`
                                : `Lesson ${activeLesson?.order}: ${activeLesson?.title || 'Select content'}`}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        {activeQuiz ? (
                            <QuizContainer
                                quiz={activeQuiz}
                                onQuizComplete={handleQuizComplete}
                                initialAttempts={quizAttempts}
                            />
                        ) : (
                            <>
                                <div className="relative aspect-video rounded-lg overflow-hidden bg-black shadow-lg">
                                    {activeLesson?.video_url ? (
                                        <ReactPlayer
                                            src={activeLesson.video_url}
                                            width="100%"
                                            height="100%"
                                            controls
                                            playing
                                            light={activeLesson.thumbnail_url}
                                            fallback={
                                                <div className="absolute inset-0 flex items-center justify-center text-white">
                                                    Loading video...
                                                </div>
                                            }
                                            config={{
                                                file: {
                                                    attributes: {
                                                        controlsList: 'nodownload',
                                                        disablePictureInPicture: true,
                                                        preload: 'metadata'
                                                    }
                                                }
                                            }}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0
                                            }}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                            No lesson selected
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-lg font-medium text-foreground">About this lesson</h3>
                                    <p className="text-sm font-bold text-muted-foreground">
                                        Lesson {activeLesson?.order}: {activeLesson?.title || 'Select a lesson to see its description'}
                                    </p>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        <span>{activeLesson?.duration || '00:00'}</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Right Sidebar */}
            <div className="w-full lg:w-1/3 h-full flex flex-col gap-4">
                <Card className="h-full">
                    <CardHeader className="pb-3">
                        <div className="flex flex-col space-y-2">
                            <CardTitle className="text-lg font-semibold text-foreground">
                                Course Contents
                            </CardTitle>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <BookOpen className="h-4 w-4" />
                                    <span>
                                        {initialCourseData.modules.length} {initialCourseData.modules.length === 1 ? 'Module' : 'Modules'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <ListVideo className="h-4 w-4" />
                                    <span>
                                        {initialCourseData.modules.reduce((acc, mod) => acc + mod.lessons.length, 0)}
                                        {' '}
                                        {initialCourseData.modules.reduce((acc, mod) => acc + mod.lessons.length, 0) === 1 ? 'Lesson' : 'Lessons'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-2">
                        <ScrollArea className="h-[calc(100vh-180px)]">
                            <div className="space-y-2 p-2">
                                {initialCourseData.modules.map(module => (
                                    <div key={module.id} className="rounded-lg py-2 my-2 overflow-hidden border">
                                        <Button
                                            disabled={!canViewFreeModule && auth.user.role !== 'admin' && module.is_paid && !hasPurchased}
                                            variant="ghost"
                                            onClick={() => toggleModule(module.id)}
                                            className="w-full flex items-center justify-between p-4 hover:bg-accent transition-colors"
                                        >
                                            <span className="font-medium text-start text-foreground">
                                                {module.order} . {module.title}
                                            </span>
                                            {expandedModules[module.id] ? (
                                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </Button>

                                        {expandedModules[module.id] && (
                                            <div className="space-y-3 pb-2 px-2">
                                                {module.lessons.map(lesson => (
                                                    <Button
                                                        disabled={!canViewFreeModule && auth.user.role !== 'admin' && module.is_paid && !hasPurchased}
                                                        key={lesson.id}
                                                        variant="ghost"
                                                        onClick={() => {
                                                            setActiveLesson(lesson)
                                                            setActiveQuiz(null)
                                                        }}
                                                        className={`w-full flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors text-left ${
                                                            activeLesson?.id === lesson.id && !activeQuiz
                                                                ? 'bg-accent border border-border'
                                                                : ''
                                                        }`}
                                                    >
                                                        <div className="relative flex-shrink-0">
                                                            <img
                                                                src={lesson.thumbnail_url ? lesson.thumbnail_url : 'https://cdn-icons-png.freepik.com/256/8861/8861889.png?semt=ais_incoming'}
                                                                alt={lesson.title}
                                                                className="w-12 h-8 object-cover rounded"
                                                            />
                                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded">
                                                                <Play className="h-3 w-3 text-white" />
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm font-medium text-foreground truncate">
                                                                {module.order}.{lesson.order} {lesson.title}
                                                            </h4>
                                                            <p className="text-xs text-muted-foreground">
                                                                {lesson.duration}
                                                            </p>
                                                        </div>
                                                    </Button>
                                                ))}

                                                {module.quiz && (
                                                    <Button
                                                        disabled={
                                                            (!canViewFreeModule && auth?.user.role !== 'admin' && module.is_paid && !hasPurchased) ||
                                                            (quizAttempts >= module.quiz.max_attempts)
                                                        }
                                                        variant="ghost"
                                                        onClick={() => startQuiz(module.quiz!)}
                                                        className={`w-full flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors text-left ${
                                                            activeQuiz?.id === module.quiz.id
                                                                ? 'bg-accent border border-border'
                                                                : ''
                                                        }`}
                                                    >
                                                        <div className="relative flex-shrink-0 w-12 h-8 flex items-center justify-center bg-purple-100 dark:bg-purple-900 rounded">
                                                            <span className="text-purple-600 dark:text-purple-300 font-bold">Q</span>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm font-medium text-foreground truncate">
                                                                Quiz: {module.quiz.title}
                                                            </h4>
                                                            <p className="text-xs text-muted-foreground">
                                                                {module.quiz.questions.length} questions • {module.quiz.max_attempts} attempts
                                                            </p>
                                                            {quizAttempts > 0 && (
                                                                <p className="text-xs text-muted-foreground">
                                                                    Attempts used: {quizAttempts}/{module.quiz.max_attempts}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}











// import { useState, useEffect } from 'react'
// import ReactPlayer from 'react-player'
// import { ChevronDown, ChevronRight, Clock, Play } from 'lucide-react'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { ScrollArea } from '@/components/ui/scroll-area'
// import { usePage } from '@inertiajs/react'
// import { Button } from '@/components/ui/button'
// import { BookOpen, ListVideo } from 'lucide-react'
// import { Badge } from '@/components/ui/badge'
// // import { Progress } from '@/components/ui/progress'
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
// import { Label } from '@/components/ui/label'

// interface Lesson {
//     id: string
//     title: string
//     duration: string
//     video_url: string
//     thumbnail_url: string
//     order: number
// }

// interface Quiz {
//     id: string
//     title: string
//     description: string
//     questions: Array<{
//         id: string
//         question_text: string
//         options: {
//             choices: Array<{
//                 key: string
//                 text: string
//             }>
//         }
//         correct_answer: string
//         points: number
//     }>
//     passing_score: number
//     max_attempts: number
//     max_time_limit: number
// }

// interface Module {
//     id: string
//     title: string
//     order: number
//     is_paid: boolean
//     lessons: Lesson[]
//     quiz?: Quiz
// }

// interface Course {
//     id: string
//     title: string
//     description: string
//     modules: Module[]
// }

// export default function ClassroomPage() {
//     const { course: initialCourseData, modules, canViewFreeModule, hasPurchased } = usePage<{ course: Course }>().props
//     const { auth } = usePage().props

//     const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
//     const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null)
//     const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({})
//     const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({})
//     const [quizSubmitted, setQuizSubmitted] = useState(false)
//     const [quizScore, setQuizScore] = useState(0)

//     // Initialize first lesson and expand first module
//     useEffect(() => {
//         if (initialCourseData?.modules?.length > 0 && initialCourseData.modules[0].lessons?.length > 0) {
//             setActiveLesson(initialCourseData.modules[0].lessons[0])
//             setExpandedModules({ [initialCourseData.modules[0].id]: true })
//         }
//     }, [initialCourseData])

//     const toggleModule = (moduleId: string) => {
//         setExpandedModules(prev => ({
//             ...prev,
//             [moduleId]: !prev[moduleId]
//         }))
//     }

//     const handleQuizAnswer = (questionId: string, answerKey: string) => {
//         setQuizAnswers(prev => ({
//             ...prev,
//             [questionId]: answerKey
//         }))
//     }

//     const calculateQuizScore = () => {
//         if (!activeQuiz) return 0
//         return activeQuiz.questions.reduce((score, question) => {
//             return quizAnswers[question.id] === question.correct_answer
//                 ? score + question.points
//                 : score
//         }, 0)
//     }

//     const handleQuizSubmit = () => {
//         const score = calculateQuizScore()
//         setQuizScore(score)
//         setQuizSubmitted(true)
//     }

//     const totalPossiblePoints = activeQuiz?.questions.reduce((sum, q) => sum + q.points, 0) || 0
//     const quizProgress = totalPossiblePoints > 0 ? (quizScore / totalPossiblePoints) * 100 : 0
//     const isQuizPassed = activeQuiz ? quizScore >= activeQuiz.passing_score : false

//     return (
//         <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] gap-4 p-4 bg-background">
//             {/* Video Section (2/3 width on desktop) */}
//             <div className="w-full lg:w-2/3 h-full flex flex-col gap-4">
//                 <Card className="flex-1">
//                     <CardHeader className="pb-3">
//                         <CardTitle className="text-xl font-semibold text-foreground">
//                             {activeQuiz
//                                 ? `Quiz: ${activeQuiz.title}`
//                                 : `Lesson ${activeLesson?.order}: ${activeLesson?.title || 'Select content'}`}
//                         </CardTitle>
//                     </CardHeader>
//                     <CardContent className="flex flex-col gap-4">
//                         {activeQuiz ? (
//                             <div className="space-y-6">
//                                 <div className="space-y-1">
//                                     <p className="text-muted-foreground">{activeQuiz.description}</p>
//                                     <div className="flex gap-2">
//                                         <Badge variant="outline">Attempts left: {activeQuiz.max_attempts}</Badge>
//                                         <Badge variant="outline">Passing score: {activeQuiz.passing_score}</Badge>
//                                     </div>
//                                 </div>

//                                 {activeQuiz.questions.map(question => (
//                                     <Card
//                                         key={question.id}
//                                         className={`transition-colors ${
//                                             quizSubmitted &&
//                                             quizAnswers[question.id] === question.correct_answer
//                                                 ? 'border-green-500'
//                                                 : quizSubmitted
//                                                     ? 'border-red-500'
//                                                     : ''
//                                         }`}
//                                     >
//                                         <CardHeader>
//                                             <CardTitle className="flex items-center justify-between">
//                                                 <span>{question.question_text}</span>
//                                                 <Badge variant="secondary">{question.points} points</Badge>
//                                             </CardTitle>
//                                         </CardHeader>
//                                         <CardContent>
//                                             <RadioGroup
//                                                 value={quizAnswers[question.id] || ''}
//                                                 onValueChange={(value) => handleQuizAnswer(question.id, value)}
//                                                 disabled={quizSubmitted}
//                                             >
//                                                 {question.options.choices.map(choice => (
//                                                     <div
//                                                         key={choice.key}
//                                                         className={`flex items-center space-x-3 p-3 rounded-lg ${
//                                                             quizSubmitted &&
//                                                             choice.key === question.correct_answer
//                                                                 ? 'bg-green-50 dark:bg-green-900/30'
//                                                                 : quizSubmitted &&
//                                                                     quizAnswers[question.id] === choice.key &&
//                                                                     choice.key !== question.correct_answer
//                                                                         ? 'bg-red-50 dark:bg-red-900/30'
//                                                                         : 'hover:bg-gray-50 dark:hover:bg-gray-800'
//                                                         }`}
//                                                     >
//                                                         <RadioGroupItem
//                                                             value={choice.key}
//                                                             id={`q${question.id}-${choice.key}`}
//                                                         />
//                                                         <Label
//                                                             htmlFor={`q${question.id}-${choice.key}`}
//                                                             className="w-full cursor-pointer"
//                                                         >
//                                                             <div className="flex items-center justify-between">
//                                                                 <span>
//                                                                     <span className="font-medium">{choice.key.toUpperCase()}.</span> {choice.text}
//                                                                 </span>
//                                                                 {quizSubmitted && (
//                                                                     <span className="text-sm">
//                                                                         {choice.key === question.correct_answer ? (
//                                                                             <span className="text-green-500">✓ Correct</span>
//                                                                         ) : quizAnswers[question.id] === choice.key ? (
//                                                                             <span className="text-red-500">✗ Your answer</span>
//                                                                         ) : null}
//                                                                     </span>
//                                                                 )}
//                                                             </div>
//                                                         </Label>
//                                                     </div>
//                                                 ))}
//                                             </RadioGroup>
//                                         </CardContent>
//                                     </Card>
//                                 ))}

//                                 {!quizSubmitted ? (
//                                     <Button
//                                         onClick={handleQuizSubmit}
//                                         disabled={Object.keys(quizAnswers).length !== activeQuiz.questions.length}
//                                         className="w-full"
//                                         size="lg"
//                                     >
//                                         Submit Quiz
//                                     </Button>
//                                 ) : (
//                                     <Card>
//                                         <CardHeader>
//                                             <CardTitle>Quiz Results</CardTitle>
//                                             <CardDescription>
//                                                 You scored {quizScore} out of {totalPossiblePoints} points
//                                             </CardDescription>
//                                         </CardHeader>
//                                         <CardContent className="space-y-4">
//                                             {/* <Progress value={quizProgress} className="h-3" /> */}
//                                             <div className={`text-center text-lg font-medium ${
//                                                 isQuizPassed ? 'text-green-500' : 'text-red-500'
//                                             }`}>
//                                                 {isQuizPassed ? 'Congratulations! You passed!' : 'Sorry, you did not pass.'}
//                                             </div>
//                                             <div className="flex justify-center">
//                                                 <Button
//                                                     variant="outline"
//                                                     onClick={() => setActiveQuiz(null)}
//                                                 >
//                                                     Back to Lessons
//                                                 </Button>
//                                             </div>
//                                         </CardContent>
//                                     </Card>
//                                 )}
//                             </div>
//                         ) : (
//                             <>
//                                 <div className="relative aspect-video rounded-lg overflow-hidden bg-black shadow-lg">
//                                     {activeLesson?.video_url ? (
//                                         <ReactPlayer
//                                             src={activeLesson.video_url}
//                                             width="100%"
//                                             height="100%"
//                                             controls
//                                             playing
//                                             light={activeLesson.thumbnail_url}
//                                             fallback={
//                                                 <div className="absolute inset-0 flex items-center justify-center text-white">
//                                                     Loading video...
//                                                 </div>
//                                             }
//                                             onError={(e) => console.error('Video player error:', e)}
//                                             config={{
//                                                 file: {
//                                                     attributes: {
//                                                         controlsList: 'nodownload',
//                                                         disablePictureInPicture: true,
//                                                         preload: 'metadata'
//                                                     }
//                                                 }
//                                             }}
//                                             style={{
//                                                 position: 'absolute',
//                                                 top: 0,
//                                                 left: 0
//                                             }}
//                                         />
//                                     ) : (
//                                         <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
//                                             No lesson selected
//                                         </div>
//                                     )}
//                                 </div>

//                                 {/* Lesson Description */}
//                                 <div className="space-y-2">
//                                     <h3 className="text-lg font-medium text-foreground">About this lesson</h3>
//                                     <p className="text-sm font-bold text-muted-foreground">
//                                         Lesson {activeLesson?.order}: {activeLesson?.title || 'Select a lesson to see its description'}
//                                     </p>
//                                     <div className="flex items-center gap-1 text-sm text-muted-foreground">
//                                         <Clock className="h-4 w-4" />
//                                         <span>{activeLesson?.duration || '00:00'}</span>
//                                     </div>
//                                 </div>
//                             </>
//                         )}
//                     </CardContent>
//                 </Card>
//             </div>

//             {/* Modules Sidebar (1/3 width on desktop) */}
//             <div className="w-full lg:w-1/3 h-full flex flex-col gap-4">
//                 <Card className="h-full">
//                     <CardHeader className="pb-3">
//                         <div className="flex flex-col space-y-2">
//                             <CardTitle className="text-lg font-semibold text-foreground">
//                                 Course Contents
//                             </CardTitle>
//                             <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                                 <div className="flex items-center gap-1.5">
//                                     <BookOpen className="h-4 w-4" />
//                                     <span>
//                                         {initialCourseData.modules.length} {initialCourseData.modules.length === 1 ? 'Module' : 'Modules'}
//                                     </span>
//                                 </div>
//                                 <div className="flex items-center gap-1.5">
//                                     <ListVideo className="h-4 w-4" />
//                                     <span>
//                                         {initialCourseData.modules.reduce((acc, mod) => acc + mod.lessons.length, 0)}
//                                         {' '}
//                                         {initialCourseData.modules.reduce((acc, mod) => acc + mod.lessons.length, 0) === 1 ? 'Lesson' : 'Lessons'}
//                                     </span>
//                                 </div>
//                             </div>
//                         </div>
//                     </CardHeader>
//                     <CardContent className="p-2">
//                         <ScrollArea className="h-[calc(100vh-180px)]">
//                             <div className="space-y-2 p-2">
//                                 {initialCourseData.modules.map(module => (
//                                     <div key={module.id} className="rounded-lg py-2 my-2 overflow-hidden border">
//                                         <Button
//                                             disabled={!canViewFreeModule && auth.user.role !== 'admin' && module.is_paid && !hasPurchased}
//                                             variant="ghost"
//                                             onClick={() => toggleModule(module.id)}
//                                             className="w-full flex items-center justify-between p-4 hover:bg-accent transition-colors"
//                                         >
//                                             <span className="font-medium text-start text-foreground">
//                                                 {module.order} . {module.title}
//                                             </span>
//                                             {expandedModules[module.id] ? (
//                                                 <ChevronDown className="h-4 w-4 text-muted-foreground" />
//                                             ) : (
//                                                 <ChevronRight className="h-4 w-4 text-muted-foreground" />
//                                             )}
//                                         </Button>

//                                         {expandedModules[module.id] && (
//                                             <div className="space-y-3 pb-2 px-2">
//                                                 {module.lessons.map(lesson => (
//                                                     <Button
//                                                         disabled={!canViewFreeModule && auth.user.role !== 'admin' && module.is_paid && !hasPurchased}
//                                                         key={lesson.id}
//                                                         variant="ghost"
//                                                         onClick={() => {
//                                                             setActiveLesson(lesson)
//                                                             setActiveQuiz(null)
//                                                         }}
//                                                         className={`w-full flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors text-left ${
//                                                             activeLesson?.id === lesson.id && !activeQuiz
//                                                                 ? 'bg-accent border border-border'
//                                                                 : ''
//                                                         }`}
//                                                     >
//                                                         <div className="relative flex-shrink-0">
//                                                             <img
//                                                                 src={lesson.thumbnail_url ? lesson.thumbnail_url : 'https://cdn-icons-png.freepik.com/256/8861/8861889.png?semt=ais_incoming'}
//                                                                 alt={lesson.title}
//                                                                 className="w-12 h-8 object-cover rounded"
//                                                             />
//                                                             <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded">
//                                                                 <Play className="h-3 w-3 text-white" />
//                                                             </div>
//                                                         </div>
//                                                         <div className="flex-1 min-w-0">
//                                                             <h4 className="text-sm font-medium text-foreground truncate">
//                                                                 {module.order}.{lesson.order} {lesson.title}
//                                                             </h4>
//                                                             <p className="text-xs text-muted-foreground">
//                                                                 {lesson.duration}
//                                                             </p>
//                                                         </div>
//                                                     </Button>
//                                                 ))}

//                                                 {module.quiz && (
//                                                     <Button
//                                                         disabled={!canViewFreeModule && auth.user.role !== 'admin' && module.is_paid && !hasPurchased}
//                                                         variant="ghost"
//                                                         onClick={() => {
//                                                             setActiveQuiz(module.quiz)
//                                                             setActiveLesson(null)
//                                                             setQuizAnswers({})
//                                                             setQuizSubmitted(false)
//                                                         }}
//                                                         className={`w-full flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors text-left ${
//                                                             activeQuiz?.id === module.quiz.id
//                                                                 ? 'bg-accent border border-border'
//                                                                 : ''
//                                                         }`}
//                                                     >
//                                                         <div className="relative flex-shrink-0 w-12 h-8 flex items-center justify-center bg-purple-100 dark:bg-purple-900 rounded">
//                                                             <span className="text-purple-600 dark:text-purple-300 font-bold">Q</span>
//                                                         </div>
//                                                         <div className="flex-1 min-w-0">
//                                                             <h4 className="text-sm font-medium text-foreground truncate">
//                                                                 Quiz: {module.quiz.title}
//                                                             </h4>
//                                                             <p className="text-xs text-muted-foreground">
//                                                                 {module.quiz.questions.length} questions
//                                                             </p>
//                                                         </div>
//                                                     </Button>
//                                                 )}
//                                             </div>
//                                         )}
//                                     </div>
//                                 ))}
//                             </div>
//                         </ScrollArea>
//                     </CardContent>
//                 </Card>
//             </div>
//         </div>
//     )
// }





















// import { useState, useEffect } from 'react'
// import ReactPlayer from 'react-player'
// import { ChevronDown, ChevronRight, Clock, Play } from 'lucide-react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { ScrollArea } from '@/components/ui/scroll-area'
// import { usePage } from '@inertiajs/react'
// import { Button } from '@/components/ui/button'
// import { BookOpen, ListVideo } from 'lucide-react'


// interface Lesson {
//     id: string
//     title: string
//     duration: string
//     video_url: string
//     thumbnail_url: string
//     order: number
// }

// interface Module {
//     id: string
//     title: string
//     order: number
//     is_paid: boolean
//     lessons: Lesson[]
// }

// interface Course {
//     id: string
//     title: string
//     description: string
//     modules: Module[]
// }

// export default function ClassroomPage() {
//     const { course: initialCourseData, modules, canViewFreeModule, hasPurchased } = usePage<{ course: Course }>().props

//     const {auth} = usePage().props

//     console.log('course', initialCourseData)


//     const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
//     const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({})

//     // Initialize first lesson and expand first module
//     useEffect(() => {
//         if (initialCourseData?.modules?.length > 0 && initialCourseData.modules[0].lessons?.length > 0) {
//             setActiveLesson(initialCourseData.modules[0].lessons[0])
//             setExpandedModules({ [initialCourseData.modules[0].id]: true })
//         }
//     }, [initialCourseData])

//     const toggleModule = (moduleId: string) => {
//         setExpandedModules(prev => ({
//             ...prev,
//             [moduleId]: !prev[moduleId]
//         }))
//     }

//     return (
//         <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] gap-4 p-4 bg-background">
//             {/* Video Section (3/4 width on desktop) */}
//             <div className="w-full lg:w-3/4 h-full flex flex-col gap-4">
//                 <Card className="flex-1">
//                     <CardHeader className="pb-3">
//                         <CardTitle className="text-xl font-semibold text-foreground">
//                             Lesson {activeLesson?.order}: {activeLesson?.title || 'Select a lesson to begin'}
//                         </CardTitle>
//                     </CardHeader>
//                     <CardContent className="flex flex-col gap-4">
//                         <div className="relative aspect-video rounded-lg overflow-hidden bg-black shadow-lg">
//                             {activeLesson?.video_url ? (
//                                 <ReactPlayer
//                                     src={activeLesson.video_url}
//                                     width="100%"
//                                     height="100%"
//                                     controls
//                                     playing
//                                     light={activeLesson.thumbnail_url}
//                                     fallback={
//                                         <div className="absolute inset-0 flex items-center justify-center text-white">
//                                             Loading video...
//                                         </div>
//                                     }
//                                     onError={(e) => console.error('Video player error:', e)}
//                                     config={{
//                                         file: {
//                                             attributes: {
//                                                 controlsList: 'nodownload',
//                                                 disablePictureInPicture: true,
//                                                 preload: 'metadata'
//                                             }
//                                         }
//                                     }}
//                                     style={{
//                                         position: 'absolute',
//                                         top: 0,
//                                         left: 0
//                                     }}
//                                 />
//                             ) : (
//                                 <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
//                                     No lesson selected
//                                 </div>
//                             )}
//                         </div>

//                         {/* Lesson Description */}
//                         <div className="space-y-2">
//                             <h3 className="text-lg font-medium text-foreground">About this lesson</h3>
//                             <p className="text-sm font-bold text-muted-foreground">
//                                 Lesson {activeLesson?.order}: {activeLesson?.title || 'Select a lesson to see its description'}
//                             </p>
//                             <div className="flex items-center gap-1 text-sm text-muted-foreground">
//                                 <Clock className="h-4 w-4" />
//                                 <span>{activeLesson?.duration || '00:00'}</span>
//                             </div>
//                         </div>
//                     </CardContent>
//                 </Card>
//             </div>

//             {/* Modules Sidebar (1/4 width on desktop) */}
//             <div className="w-full lg:w-1/4 h-full">
//                 <Card className="h-full">
//                     <CardHeader className="pb-3">
//                         <div className="flex flex-col space-y-2">
//                             <CardTitle className="text-lg font-semibold text-foreground">
//                                 Course Contents
//                             </CardTitle>
//                             <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                                 <div className="flex items-center gap-1.5">
//                                     <BookOpen className="h-4 w-4" />
//                                     <span>
//                                         {initialCourseData.modules.length} {initialCourseData.modules.length === 1 ? 'Module' : 'Modules'}
//                                     </span>
//                                 </div>
//                                 <div className="flex items-center gap-1.5">
//                                     <ListVideo className="h-4 w-4" />
//                                     <span>
//                                         {initialCourseData.modules.length}
//                                         {' '}
//                                         {initialCourseData.modules.reduce((acc, mod) => acc + mod.lessons.length, 0) === 1 ? 'Lesson' : 'Lessons'}
//                                     </span>
//                                 </div>
//                             </div>
//                         </div>
//                     </CardHeader>
//                     <CardContent className="p-2">
//                         <ScrollArea className="h-[calc(100vh-180px)]">
//                             <div className="space-y-2 p-2">
//                                 {initialCourseData.modules.map(module => (
//                                     <div key={module.id} className="rounded-lg py-2 my-2 overflow-hidden border">
//                                         <Button
//                                         disabled={!canViewFreeModule && auth.user.role !== 'admin' && module.is_paid && !hasPurchased}
//                                             variant="ghost"
//                                             onClick={() => toggleModule(module.id)}
//                                             className="w-full flex items-center justify-between p-4 hover:bg-accent transition-colors"
//                                         >
//                                             <span className="font-medium text-start text-foreground">
//                                                 {module.order} . {module.title}
//                                             </span>
//                                             {expandedModules[module.id] ? (
//                                                 <ChevronDown className="h-4 w-4 text-muted-foreground" />
//                                             ) : (
//                                                 <ChevronRight className="h-4 w-4 text-muted-foreground" />
//                                             )}
//                                         </Button>

//                                         {expandedModules[module.id] && (
//                                             <div className="space-y-3 pb-2 px-2">
//                                                 {module.lessons.map(lesson => (
//                                                     <Button
//                                                         disabled={!canViewFreeModule && auth.user.role !== 'admin' && module.is_paid && !hasPurchased}
//                                                         key={lesson.id}
//                                                         variant="ghost"
//                                                         onClick={() => setActiveLesson(lesson)}
//                                                         className={`w-full flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors text-left ${activeLesson?.id === lesson.id
//                                                             ? 'bg-accent border border-border'
//                                                             : ''
//                                                             }`}
//                                                     >
//                                                         <div className="relative flex-shrink-0">
//                                                             <img
//                                                                 src={lesson.thumbnail_url ? lesson.video_url : 'https://cdn-icons-png.freepik.com/256/8861/8861889.png?semt=ais_incoming'}
//                                                                 alt={lesson.title}
//                                                                 className="w-12 h-8 object-cover rounded"
//                                                             />
//                                                             <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded">
//                                                                 <Play className="h-3 w-3 text-white" />
//                                                             </div>
//                                                         </div>
//                                                         <div className="flex-1 min-w-0">

//                                                             <h4 className="text-sm font-medium text-foreground truncate">
//                                                                 {module.order} . {lesson?.order} . {lesson.title}
//                                                             </h4>
//                                                             <p className="text-xs text-muted-foreground">
//                                                                 {lesson.duration}
//                                                             </p>
//                                                         </div>
//                                                     </Button>
//                                                 ))}
//                                             </div>
//                                         )}
//                                     </div>
//                                 ))}
//                             </div>
//                         </ScrollArea>
//                     </CardContent>
//                 </Card>
//             </div>
//         </div>
//     )
// }
















// import { useState, useEffect } from 'react'
// import ReactPlayer from 'react-player'
// import { ChevronDown, ChevronRight, Clock, Play } from 'lucide-react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { ScrollArea } from '@/components/ui/scroll-area'
// import { usePage } from '@inertiajs/react'
// import { Button } from '@/components/ui/button'
// import { BookOpen, ListVideo } from 'lucide-react'


// interface Lesson {
//     id: string
//     title: string
//     duration: string
//     video_url: string
//     thumbnail_url: string
//     order: number
// }

// interface Module {
//     id: string
//     title: string
//     order: number
//     is_paid: boolean
//     lessons: Lesson[]
// }

// interface Course {
//     id: string
//     title: string
//     description: string
//     modules: Module[]
// }

// export default function ClassroomPage() {
//     const { course: initialCourseData, modules, canViewFreeModule, hasPurchased } = usePage<{ course: Course }>().props

//     const {auth} = usePage().props


//     const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
//     const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({})

//     // Initialize first lesson and expand first module
//     useEffect(() => {
//         if (initialCourseData?.modules?.length > 0 && initialCourseData.modules[0].lessons?.length > 0) {
//             setActiveLesson(initialCourseData.modules[0].lessons[0])
//             setExpandedModules({ [initialCourseData.modules[0].id]: true })
//         }
//     }, [initialCourseData])

//     const toggleModule = (moduleId: string) => {
//         setExpandedModules(prev => ({
//             ...prev,
//             [moduleId]: !prev[moduleId]
//         }))
//     }

//     return (
//         <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] gap-4 p-4 bg-background">
//             {/* Video Section (3/4 width on desktop) */}
//             <div className="w-full lg:w-3/4 h-full flex flex-col gap-4">
//                 <Card className="flex-1">
//                     <CardHeader className="pb-3">
//                         <CardTitle className="text-xl font-semibold text-foreground">
//                             Lesson {activeLesson?.order}: {activeLesson?.title || 'Select a lesson to begin'}
//                         </CardTitle>
//                     </CardHeader>
//                     <CardContent className="flex flex-col gap-4">
//                         <div className="relative aspect-video rounded-lg overflow-hidden bg-black shadow-lg">
//                             {activeLesson?.video_url ? (
//                                 <ReactPlayer
//                                     src={activeLesson.video_url}
//                                     width="100%"
//                                     height="100%"
//                                     controls
//                                     playing
//                                     light={activeLesson.thumbnail_url}
//                                     fallback={
//                                         <div className="absolute inset-0 flex items-center justify-center text-white">
//                                             Loading video...
//                                         </div>
//                                     }
//                                     onError={(e) => console.error('Video player error:', e)}
//                                     config={{
//                                         file: {
//                                             attributes: {
//                                                 controlsList: 'nodownload',
//                                                 disablePictureInPicture: true,
//                                                 preload: 'metadata'
//                                             }
//                                         }
//                                     }}
//                                     style={{
//                                         position: 'absolute',
//                                         top: 0,
//                                         left: 0
//                                     }}
//                                 />
//                             ) : (
//                                 <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
//                                     No lesson selected
//                                 </div>
//                             )}
//                         </div>

//                         {/* Lesson Description */}
//                         <div className="space-y-2">
//                             <h3 className="text-lg font-medium text-foreground">About this lesson</h3>
//                             <p className="text-sm font-bold text-muted-foreground">
//                                 Lesson {activeLesson?.order}: {activeLesson?.title || 'Select a lesson to see its description'}
//                             </p>
//                             <div className="flex items-center gap-1 text-sm text-muted-foreground">
//                                 <Clock className="h-4 w-4" />
//                                 <span>{activeLesson?.duration || '00:00'}</span>
//                             </div>
//                         </div>
//                     </CardContent>
//                 </Card>
//             </div>

//             {/* Modules Sidebar (1/4 width on desktop) */}
//             <div className="w-full lg:w-1/4 h-full">
//                 <Card className="h-full">
//                     <CardHeader className="pb-3">
//                         <div className="flex flex-col space-y-2">
//                             <CardTitle className="text-lg font-semibold text-foreground">
//                                 Course Contents
//                             </CardTitle>
//                             <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                                 <div className="flex items-center gap-1.5">
//                                     <BookOpen className="h-4 w-4" />
//                                     <span>
//                                         {initialCourseData.modules.length} {initialCourseData.modules.length === 1 ? 'Module' : 'Modules'}
//                                     </span>
//                                 </div>
//                                 <div className="flex items-center gap-1.5">
//                                     <ListVideo className="h-4 w-4" />
//                                     <span>
//                                         {initialCourseData.modules.length}
//                                         {' '}
//                                         {initialCourseData.modules.reduce((acc, mod) => acc + mod.lessons.length, 0) === 1 ? 'Lesson' : 'Lessons'}
//                                     </span>
//                                 </div>
//                             </div>
//                         </div>
//                     </CardHeader>
//                     <CardContent className="p-2">
//                         <ScrollArea className="h-[calc(100vh-180px)]">
//                             <div className="space-y-2 p-2">
//                                 {initialCourseData.modules.map(module => (
//                                     <div key={module.id} className="rounded-lg py-2 my-2 overflow-hidden border">
//                                         <Button
//                                         disabled={!canViewFreeModule && auth.user.role !== 'admin' && module.is_paid && !hasPurchased}
//                                             variant="ghost"
//                                             onClick={() => toggleModule(module.id)}
//                                             className="w-full flex items-center justify-between p-4 hover:bg-accent transition-colors"
//                                         >
//                                             <span className="font-medium text-start text-foreground">
//                                                 {module.order} . {module.title}
//                                             </span>
//                                             {expandedModules[module.id] ? (
//                                                 <ChevronDown className="h-4 w-4 text-muted-foreground" />
//                                             ) : (
//                                                 <ChevronRight className="h-4 w-4 text-muted-foreground" />
//                                             )}
//                                         </Button>

//                                         {expandedModules[module.id] && (
//                                             <div className="space-y-3 pb-2 px-2">
//                                                 {module.lessons.map(lesson => (
//                                                     <Button
//                                                         disabled={!canViewFreeModule && auth.user.role !== 'admin' && module.is_paid && !hasPurchased}
//                                                         key={lesson.id}
//                                                         variant="ghost"
//                                                         onClick={() => setActiveLesson(lesson)}
//                                                         className={`w-full flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors text-left ${activeLesson?.id === lesson.id
//                                                             ? 'bg-accent border border-border'
//                                                             : ''
//                                                             }`}
//                                                     >
//                                                         <div className="relative flex-shrink-0">
//                                                             <img
//                                                                 src={lesson.thumbnail_url ? lesson.video_url : 'https://cdn-icons-png.freepik.com/256/8861/8861889.png?semt=ais_incoming'}
//                                                                 alt={lesson.title}
//                                                                 className="w-12 h-8 object-cover rounded"
//                                                             />
//                                                             <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded">
//                                                                 <Play className="h-3 w-3 text-white" />
//                                                             </div>
//                                                         </div>
//                                                         <div className="flex-1 min-w-0">

//                                                             <h4 className="text-sm font-medium text-foreground truncate">
//                                                                 {module.order} . {lesson?.order} . {lesson.title}
//                                                             </h4>
//                                                             <p className="text-xs text-muted-foreground">
//                                                                 {lesson.duration}
//                                                             </p>
//                                                         </div>
//                                                     </Button>
//                                                 ))}
//                                             </div>
//                                         )}
//                                     </div>
//                                 ))}
//                             </div>
//                         </ScrollArea>
//                     </CardContent>
//                 </Card>
//             </div>
//         </div>
//     )
// }













// import { useState, useEffect } from 'react'
// import ReactPlayer from 'react-player'
// // import ReactPlayer from 'react-player/file';
// import { ChevronDown, ChevronRight, Play } from 'lucide-react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { ScrollArea } from '@/components/ui/scroll-area'
// import { usePage } from '@inertiajs/react'
// import { Button } from '@/components/ui/button'

// interface Lesson {
//     id: string
//     title: string
//     duration: string
//     video_url: string
//     thumbnail_url: string
//     order: number
// }

// interface Module {
//     id: string
//     title: string
//     order: number
//     lessons: Lesson[]
// }

// interface Course {
//     id: string
//     title: string
//     description: string
//     modules: Module[]
// }

// export default function ClassroomPage() {
//     const { course: initialCourseData } = usePage<{
//         course: Course
//     }>().props

//     //   console.log('course', initialCourseData);

//     const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
//     const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({})

//     // Initialize the first lesson and expand the first module
//     useEffect(() => {
//         if (initialCourseData?.modules?.length > 0 && initialCourseData.modules[0].lessons?.length > 0) {
//             setActiveLesson(initialCourseData.modules[0].lessons[0])
//             setExpandedModules(prev => ({ ...prev, [initialCourseData.modules[0].id]: true }))
//         }
//     }, [initialCourseData])

//     const toggleModule = (moduleId: string) => {
//         setExpandedModules(prev => ({
//             ...prev,
//             [moduleId]: !prev[moduleId]
//         }))
//     }

//     console.log('action lesson', activeLesson)

//     return (
//         <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] gap-6 p-6 bg-gray-50">
//             {/* Main Video Player */}
//             <div className="lg:w-3/4 h-full">
//                 <Card className="h-full">
//                     <CardHeader>
//                         <CardTitle>
//                             {activeLesson?.title || 'Select a lesson to begin'}
//                         </CardTitle>
//                     </CardHeader>
//                     <CardContent className="h-[calc(100%-80px)]">
//                         <div className="aspect-video bg-black rounded-lg overflow-hidden">
//                             {activeLesson ? (
//                                 <ReactPlayer
//                                     url={activeLesson?.video_url}
//                                     width="100%"
//                                     height="100%"
//                                     controls
//                                     playing
//                                     light={!!activeLesson?.thumbnail_url && activeLesson.thumbnail_url}
//                                     onError={(e) => console.error('Video player error:', e)}
//                                     style={{ aspectRatio: '16/9', backgroundColor: 'black' }}
//                                 />
//                             ) : (
//                                 <div className="w-full h-full flex items-center justify-center text-white">
//                                     <p>No lesson selected</p>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Lesson Description */}
//                         <div className="mt-6">
//                             <h3 className="text-xl font-semibold">About this lesson</h3>
//                             <p className="text-gray-600 mt-2">
//                                 {activeLesson?.title || 'Select a lesson to see its description'}
//                             </p>
//                         </div>
//                     </CardContent>
//                 </Card>
//             </div>

//             {/* Modules Navigation */}
//             <div className="lg:w-1/4 h-full">
//                 <Card className="h-full">
//                     <CardHeader>
//                         <CardTitle>Course Content</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <ScrollArea className="h-[calc(100vh-180px)] pr-4">
//                             <div className="space-y-2">
//                                 {initialCourseData?.modules?.map(module => (
//                                     <div key={module.id} className="border rounded-lg overflow-hidden">
//                                         <Button
//                                             onClick={() => toggleModule(module.id)}
//                                             className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
//                                         >
//                                             <span className="font-medium">{module.title}</span>
//                                             {expandedModules[module.id] ? (
//                                                 <ChevronDown className="h-5 w-5" />
//                                             ) : (
//                                                 <ChevronRight className="h-5 w-5" />
//                                             )}
//                                         </Button>

//                                         {expandedModules[module.id] && (
//                                             <div className="space-y-1 pb-2 px-2">
//                                                 {module.lessons.map(lesson => (
//                                                     <Button
//                                                         key={lesson.id}
//                                                         onClick={() => setActiveLesson(lesson)}
//                                                         className={`w-full flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 transition-colors text-left ${activeLesson?.id === lesson.id ? "bg-blue-50 border border-blue-200" : ""
//                                                             }`}
//                                                     >
//                                                         <div className="relative">
//                                                             <img
//                                                                 src={lesson?.thumbnail_url}
//                                                                 alt={lesson?.title}
//                                                                 className="w-16 h-10 object-cover rounded"
//                                                             />
//                                                             <div className="absolute inset-0 flex items-center justify-center">
//                                                                 <Play className="h-4 w-4 text-white" />
//                                                             </div>
//                                                         </div>
//                                                         <div className="flex-1">
//                                                             <h4 className="text-sm font-medium">{lesson.title}</h4>
//                                                             <p className="text-xs text-gray-500">{lesson.duration}</p>
//                                                         </div>
//                                                     </Button>
//                                                 ))}
//                                             </div>
//                                         )}
//                                     </div>
//                                 ))}
//                             </div>
//                         </ScrollArea>
//                     </CardContent>
//                 </Card>
//             </div>
//         </div>
//     )
// }




















// import { useState, useEffect } from 'react'
// import ReactPlayer from 'react-player'
// import { ChevronDown, ChevronRight, Play, Lock } from 'lucide-react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { ScrollArea } from '@/components/ui/scroll-area'
// import { usePage } from '@inertiajs/react'

// interface Lesson {
//     id: string
//     title: string
//     duration: string
//     video_url: string
//     thumbnail_url: string
//     order: number
// }

// interface Module {
//     id: string
//     title: string
//     order: number
//     lessons: Lesson[]
//     is_paid: boolean
// }

// interface Course {
//     id: string
//     title: string
//     description: string
//     modules: Module[]
//     is_paid: boolean
// }

// export default function ClassroomPage() {
//     const { course: initialCourseData } = usePage<{
//         course: Course
//     }>().props

//     const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
//     const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({})
//     const [course, setCourse] = useState<Course>(initialCourseData)

//     // Initialize the first lesson and expand the first module
//     useEffect(() => {
//         if (course?.modules?.length > 0 && course?.modules[0].lessons?.length > 0) {
//             setActiveLesson(course?.modules[0].lessons[0])
//             setExpandedModules(prev => ({ ...prev, [course?.modules[0].id]: true }))
//         }
//     }, [course])

//     const toggleModule = (moduleId: string) => {
//         setExpandedModules(prev => ({
//             ...prev,
//             [moduleId]: !prev[moduleId]
//         }))
//     }

//     return (
//         <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] gap-6 p-6 bg-gray-50">
//             {/* Main Video Player */}
//             <div className="lg:w-3/4 h-full">
//                 <Card className="h-full">
//                     <CardHeader>
//                         <CardTitle>
//                             {activeLesson?.title || 'Select a lesson to begin'}
//                         </CardTitle>
//                     </CardHeader>
//                     <CardContent className="h-[calc(100%-80px)]">
//                         <div className="aspect-video bg-black rounded-lg overflow-hidden">
//                             {activeLesson ? (
//                                 <ReactPlayer
//                                     url={activeLesson.video_url}
//                                     width="100%"
//                                     height="100%"
//                                     controls
//                                     playing
//                                     config={{
//                                         file: {
//                                             attributes: {
//                                                 controlsList: 'nodownload'
//                                             }
//                                         }
//                                     }}
//                                 />
//                             ) : (
//                                 <div className="w-full h-full flex items-center justify-center text-white">
//                                     <p>No lesson selected</p>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Lesson Description */}
//                         <div className="mt-6">
//                             <h3 className="text-xl font-semibold">About this lesson</h3>
//                             <p className="text-gray-600 mt-2">
//                                 {activeLesson?.title || 'Select a lesson to see its description'}
//                             </p>
//                         </div>
//                     </CardContent>
//                 </Card>
//             </div>

//             {/* Modules Navigation */}
//             <div className="lg:w-1/4 h-full">
//                 <Card className="h-full">
//                     <CardHeader>
//                         <CardTitle>Course Content</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <ScrollArea className="h-[calc(100vh-180px)] pr-4">
//                             <div className="space-y-2">
//                                 {course?.modules?.map(module => (
//                                     <div key={module.id} className="border rounded-lg overflow-hidden">
//                                         <button
//                                             onClick={() => toggleModule(module.id)}
//                                             className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
//                                         >
//                                             <span className="font-medium">{module.title}</span>
//                                             {expandedModules[module.id] ? (
//                                                 <ChevronDown className="h-5 w-5" />
//                                             ) : (
//                                                 <ChevronRight className="h-5 w-5" />
//                                             )}
//                                         </button>

//                                         {expandedModules[module.id] && (
//                                             <div className="space-y-1 pb-2 px-2">
//                                                 {module?.lessons?.map(lesson => (
//                                                     <button
//                                                         key={lesson.id}
//                                                         onClick={() => setActiveLesson(lesson)}
//                                                         className={`w-full flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 transition-colors text-left ${activeLesson?.id === lesson.id ? "bg-blue-50 border border-blue-200" : ""
//                                                             } ${!lesson.module.is_paid && !course.is_paid ? "opacity-60 cursor-not-allowed" : ""
//                                                             }`}
//                                                         disabled={!lesson.is_preview && !course.is_paid}
//                                                     >
//                                                         <div className="relative">
//                                                             <img
//                                                                 src={lesson.thumbnail_url}
//                                                                 alt={lesson.title}
//                                                                 className="w-16 h-10 object-cover rounded"
//                                                             />
//                                                             <div className="absolute inset-0 flex items-center justify-center">
//                                                                 {lesson.module.is_paid || !course.is_paid ? (
//                                                                     <Play className="h-4 w-4 text-white" />
//                                                                 ) : (
//                                                                     <Lock className="h-4 w-4 text-white" />
//                                                                 )}
//                                                             </div>
//                                                         </div>
//                                                         <div className="flex-1">
//                                                             <h4 className="text-sm font-medium">{lesson.title}</h4>
//                                                             <p className="text-xs text-gray-500">{lesson.duration}</p>
//                                                         </div>
//                                                         {lesson.module.is_paid && (
//                                                             <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
//                                                                 Preview
//                                                             </span>
//                                                         )}
//                                                     </button>
//                                                 ))}
//                                             </div>
//                                         )}
//                                     </div>
//                                 ))}
//                             </div>
//                         </ScrollArea>
//                     </CardContent>
//                 </Card>
//             </div>
//         </div>
//     )
// }
