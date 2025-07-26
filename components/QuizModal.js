// file: components/QuizModal.js
import { useState, useEffect } from 'react';
import { QUIZ_DATA } from '@/lib/constants';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

export default function QuizModal({ isOpen, experimentId, onFinish, onRestart }) {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setQuestions(QUIZ_DATA[experimentId] || []);
            setCurrentQuestionIndex(0);
            setScore(0);
            setSelectedAnswer(null);
            setIsAnswered(false);
            setQuizCompleted(false);
        }
    }, [isOpen, experimentId]);

    const currentQuestion = questions[currentQuestionIndex];

    const handleAnswerSelect = (option) => {
        if (!isAnswered) {
            setSelectedAnswer(option);
        }
    };

    const handleCheckAnswer = () => {
        if (selectedAnswer === null) {
            alert("Please select an answer!");
            return;
        }
        setIsAnswered(true);
        if (selectedAnswer === currentQuestion.correctAnswer) {
            setScore(prev => prev + 1);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } else {
            setQuizCompleted(true);
        }
    };

    // THE FIX: This function now builds the entire className string with Tailwind utilities
    const getOptionClasses = (option) => {
        const baseClasses = "w-full text-left p-3 border-2 rounded-lg transition-all";

        // Stage 1: The question has been answered and is locked
        if (isAnswered) {
            if (option === currentQuestion.correctAnswer) {
                return `${baseClasses} border-green-500 bg-green-500/10 text-green-700 font-semibold`;
            }
            if (option === selectedAnswer) {
                return `${baseClasses} border-destructive bg-destructive/10 text-destructive font-semibold`;
            }
            // Unchosen, incorrect options are disabled
            return `${baseClasses} bg-background border-border opacity-60`;
        }

        // Stage 2: The question is active and waiting for a choice
        if (selectedAnswer === option) {
            // The currently selected answer gets a primary border and ring
            return `${baseClasses} border-primary bg-accent ring-2 ring-primary/40`;
        }

        // Default state: unselected, active question
        return `${baseClasses} bg-background border-border hover:bg-accent`;
    };


    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onFinish()}>
            <DialogContent className="max-w-3xl h-[80vh] flex flex-col sm:h-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Final Analysis Quiz</DialogTitle>
                    <DialogDescription>Test your understanding of the experiment.</DialogDescription>
                </DialogHeader>
                <div className="flex-grow overflow-y-auto pr-4 -mr-4">
                    {!quizCompleted && currentQuestion ? (
                        <div>
                            <p className="text-sm font-semibold text-purple-600">
                                Question {currentQuestionIndex + 1} of {questions.length}
                            </p>
                            <p className="text-xl font-semibold my-3">{currentQuestion.question}</p>
                            <div className="space-y-3 my-4">
                                {currentQuestion.options.map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => handleAnswerSelect(opt)}
                                        disabled={isAnswered}
                                        // The className is now fully determined by the helper function
                                        className={getOptionClasses(opt)}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                            {isAnswered && (
                                <div className={`p-3 rounded-lg my-4 text-sm animate-in fade-in ${selectedAnswer === currentQuestion.correctAnswer ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
                                    <p className={`font-bold ${selectedAnswer === currentQuestion.correctAnswer ? 'text-green-700' : 'text-red-700'}`}>
                                        {selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect.'}
                                    </p>
                                    <p className="text-gray-600">{currentQuestion.explanation}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center flex flex-col justify-center items-center h-full py-10">
                            <h2 className="text-3xl font-bold mb-2 text-purple-700">Quiz Complete!</h2>
                            <p className="text-2xl mb-4">You scored {score} out of {questions.length}.</p>
                            <div className="flex justify-center items-center gap-4 mt-8">
                                <Button variant="outline" onClick={onRestart}>Restart Experiment</Button>
                                <Button onClick={onFinish}>Back to Home</Button>
                            </div>
                        </div>
                    )}
                </div>
                {!quizCompleted && currentQuestion && (
                    <div className="flex justify-between items-center pt-4 border-t">
                        <p className="font-bold">Score: {score}/{questions.length}</p>
                        {!isAnswered ? (
                            <Button onClick={handleCheckAnswer}>Check Answer</Button>
                        ) : (
                            <Button onClick={handleNextQuestion}>
                                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                            </Button>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}