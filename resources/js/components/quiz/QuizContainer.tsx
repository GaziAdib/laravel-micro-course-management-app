import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Clock } from 'lucide-react'
import { Progress } from '../ui/progress'

interface QuizQuestion {
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
}

interface QuizProps {
    quiz: {
        id: string
        title: string
        description: string
        questions: QuizQuestion[]
        passing_score: number
        max_attempts: number
        max_time_limit: number
    }
    onQuizComplete?: () => void
    initialAttempts?: number
}

export function QuizContainer({ quiz, onQuizComplete, initialAttempts = 0 }: QuizProps) {
    const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({})
    const [quizSubmitted, setQuizSubmitted] = useState(false)
    const [quizScore, setQuizScore] = useState(0)
    const [timeLeft, setTimeLeft] = useState(quiz.max_time_limit)
    const [quizAttempts, setQuizAttempts] = useState(initialAttempts)
    const [timerActive, setTimerActive] = useState(true)

    // Timer effect
    useEffect(() => {
        let timer: NodeJS.Timeout

        if (timerActive && timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
        } else if (timerActive && timeLeft === 0) {
            handleAutoSubmit()
        }

        return () => clearTimeout(timer)
    }, [timeLeft, timerActive])

    const handleQuizAnswer = (questionId: string, answerKey: string) => {
        setQuizAnswers(prev => ({
            ...prev,
            [questionId]: answerKey
        }))
    }

    const calculateQuizScore = () => {
        return quiz.questions.reduce((score, question) => {
            return quizAnswers[question.id] === question.correct_answer
                ? score + question.points
                : score
        }, 0)
    }

    const handleQuizSubmit = () => {
        const score = calculateQuizScore()
        setQuizScore(score)
        setQuizSubmitted(true)
        setTimerActive(false)
        setQuizAttempts(prev => prev + 1)
    }

    const handleAutoSubmit = () => {
        const score = calculateQuizScore()
        setQuizScore(score)
        setQuizSubmitted(true)
        setTimerActive(false)
        setQuizAttempts(prev => prev + 1)
        alert("Time's up! Your quiz has been automatically submitted.")
    }

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600)
        const mins = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const totalPossiblePoints = quiz.questions.reduce((sum, q) => sum + q.points, 0)
    const quizProgress = totalPossiblePoints > 0 ? (quizScore / totalPossiblePoints) * 100 : 0
    const isQuizPassed = quizScore >= quiz.passing_score
    const attemptsLeft = quiz.max_attempts - quizAttempts
    const canAttemptQuiz = attemptsLeft > 0 && !quizSubmitted

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <p className="text-muted-foreground">{quiz.description}</p>
                <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline">
                        Attempts left: {attemptsLeft}
                    </Badge>
                    <Badge variant="outline">
                        Passing score: {quiz.passing_score}/{totalPossiblePoints}
                    </Badge>
                    <Badge variant={timeLeft > 60 ? "default" : "destructive"} className="ml-auto">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTime(timeLeft)}
                    </Badge>
                </div>
            </div>

            {quiz.questions.map(question => (
                <Card
                    key={question.id}
                    className={`transition-colors ${
                        quizSubmitted &&
                        quizAnswers[question.id] === question.correct_answer
                            ? 'border-green-500'
                            : quizSubmitted
                                ? 'border-red-500'
                                : ''
                    }`}
                >
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>{question.question_text}</span>
                            <Badge variant="secondary">{question.points} points</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup
                            value={quizAnswers[question.id] || ''}
                            onValueChange={(value) => handleQuizAnswer(question.id, value)}
                            disabled={quizSubmitted || !canAttemptQuiz}
                        >
                            {question.options.choices.map(choice => (
                                <div
                                    key={choice.key}
                                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                                        quizSubmitted &&
                                        choice.key === question.correct_answer
                                            ? 'bg-green-50 dark:bg-green-900/30'
                                            : quizSubmitted &&
                                                quizAnswers[question.id] === choice.key &&
                                                choice.key !== question.correct_answer
                                                ? 'bg-red-50 dark:bg-red-900/30'
                                                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                                >
                                    <RadioGroupItem
                                        value={choice.key}
                                        id={`q${question.id}-${choice.key}`}
                                    />
                                    <Label
                                        htmlFor={`q${question.id}-${choice.key}`}
                                        className="w-full cursor-pointer"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>
                                                <span className="font-medium">{choice.key.toUpperCase()}.</span> {choice.text}
                                            </span>
                                            {quizSubmitted && (
                                                <span className="text-sm">
                                                    {choice.key === question.correct_answer ? (
                                                        <span className="text-green-500">✓ Correct</span>
                                                    ) : quizAnswers[question.id] === choice.key ? (
                                                        <span className="text-red-500">✗ Your answer</span>
                                                    ) : null}
                                                </span>
                                            )}
                                        </div>
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </CardContent>
                </Card>
            ))}

            {!quizSubmitted ? (
                <Button
                    onClick={handleQuizSubmit}
                    disabled={
                        Object.keys(quizAnswers).length !== quiz.questions.length ||
                        !canAttemptQuiz
                    }
                    className="w-full"
                    size="lg"
                >
                    {canAttemptQuiz ? 'Submit Quiz' : 'No Attempts Left'}
                </Button>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Quiz Results</CardTitle>
                        <CardDescription>
                            You scored {quizScore} out of {totalPossiblePoints} points
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Progress value={quizProgress}  className="h-3" />
                        <div className={`text-center text-lg font-medium ${
                            isQuizPassed ? 'text-green-500' : 'text-red-500'
                        }`}>
                            {isQuizPassed ? 'Congratulations! You passed!' : 'Sorry, you did not pass.'}
                        </div>
                        <div className="flex justify-center gap-2">
                            {attemptsLeft > 0 && (
                                <Button
                                    onClick={() => {
                                        setQuizAnswers({})
                                        setQuizSubmitted(false)
                                        setTimeLeft(quiz.max_time_limit)
                                        setTimerActive(true)
                                    }}
                                >
                                    Try Again ({attemptsLeft} left)
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                onClick={onQuizComplete}
                            >
                                Back to Lessons
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
