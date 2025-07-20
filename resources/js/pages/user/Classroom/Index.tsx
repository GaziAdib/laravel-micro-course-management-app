import { useState, useEffect } from 'react'
import ReactPlayer from 'react-player'
import { ChevronDown, ChevronRight, Clock, Play } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { usePage } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { BookOpen, ListVideo } from 'lucide-react'


interface Lesson {
    id: string
    title: string
    duration: string
    video_url: string
    thumbnail_url: string
    order: number
}

interface Module {
    id: string
    title: string
    order: number
    lessons: Lesson[]
}

interface Course {
    id: string
    title: string
    description: string
    modules: Module[]
}

export default function ClassroomPage() {
    const { course: initialCourseData } = usePage<{ course: Course }>().props

    const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
    const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({})

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

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] gap-4 p-4 bg-background">
            {/* Video Section (3/4 width on desktop) */}
            <div className="w-full lg:w-3/4 h-full flex flex-col gap-4">
                <Card className="flex-1">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-xl font-semibold text-foreground">
                            Lesson {activeLesson?.order}: {activeLesson?.title || 'Select a lesson to begin'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
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
                                    onError={(e) => console.error('Video player error:', e)}
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

                        {/* Lesson Description */}
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
                    </CardContent>
                </Card>
            </div>

            {/* Modules Sidebar (1/4 width on desktop) */}
            <div className="w-full lg:w-1/4 h-full">
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
                                        {initialCourseData.modules.length}
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
                                                        key={lesson.id}
                                                        variant="ghost"
                                                        onClick={() => setActiveLesson(lesson)}
                                                        className={`w-full flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors text-left ${activeLesson?.id === lesson.id
                                                            ? 'bg-accent border border-border'
                                                            : ''
                                                            }`}
                                                    >
                                                        <div className="relative flex-shrink-0">
                                                            <img
                                                                src={lesson.thumbnail_url ? lesson.video_url : 'https://cdn-icons-png.freepik.com/256/8861/8861889.png?semt=ais_incoming'}
                                                                alt={lesson.title}
                                                                className="w-12 h-8 object-cover rounded"
                                                            />
                                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded">
                                                                <Play className="h-3 w-3 text-white" />
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 min-w-0">

                                                            <h4 className="text-sm font-medium text-foreground truncate">
                                                                {module.order} . {lesson?.order} . {lesson.title}
                                                            </h4>
                                                            <p className="text-xs text-muted-foreground">
                                                                {lesson.duration}
                                                            </p>
                                                        </div>
                                                    </Button>
                                                ))}
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
