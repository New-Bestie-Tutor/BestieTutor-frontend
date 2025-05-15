import React from 'react';
import { useLocation } from 'react-router-dom';

export default function ProgressBar() {
    const location = useLocation();

    // 페이지 진행 순서
    const steps = ['/chooseLanguage', '/learningGoal', '/currentLevel', '/preferredTopic'];
    const currentStep = steps.indexOf(location.pathname);

    // 만약 경로가 steps에 없다면 0%로
    const progressPercent = currentStep >= 0 ? ((currentStep + 1) / steps.length) * 100 : 0;

    return (
        <div className="progress-bar">
            <div className="progress-filled" style={{ width: `${progressPercent}%` }} />
        </div>
    );
}