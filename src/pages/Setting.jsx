import { Link } from 'react-router-dom';
import { useEffect, useState, useContext } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { UserContext } from "../UserContext";
import { LanguageContext } from "../LanguageContext";
import "../App.css";

const defaultSettings = {
    notificationTime: "18:00",
    ttsSpeed: "normal",
    feedbackVolume: 50,
    pronunciationAccuracy: "medium",
    theme: "light",
    fontSize: "medium",
    language: "ko",
};

export default function Setting() {
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem("userSettings");
        return saved ? JSON.parse(saved) : defaultSettings;
    });

    useEffect(() => {
        localStorage.setItem("userSettings", JSON.stringify(settings));
    }, [settings]);

    const handleChange = (key, value) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="Home">
            <Header />
            <div className="settings-page">
                <div className="setting-content">
                    <div className="setting-top-bar">
                        <Link to="/mypage" className="setting-back-arrow">←</Link>
                        <h1>설정</h1>
                    </div>
                    <div className="setting-item">
                        <label>알림 시간</label>
                        <input
                            type="time"
                            value={settings.notificationTime}
                            onChange={(e) => handleChange("notificationTime", e.target.value)}
                        />
                    </div>
                    <div className="setting-item">
                        <label>TTS 속도</label>
                        <select
                            value={settings.ttsSpeed}
                            onChange={(e) => handleChange("ttsSpeed", e.target.value)}
                        >
                            <option value="slow">느리게</option>
                            <option value="normal">보통</option>
                            <option value="fast">빠르게</option>
                        </select>
                    </div>
                    <div className="setting-item">
                        <label>볼륨: {settings.volume}</label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={settings.volume}
                            onChange={(e) =>
                                handleChange("volume", parseInt(e.target.value))
                            }
                        />
                    </div>
                    <div className="setting-item">
                        <label>발음 정확도 기준</label>
                        <select
                            value={settings.pronunciationAccuracy}
                            onChange={(e) =>
                                handleChange("pronunciationAccuracy", e.target.value)
                            }
                        >
                            <option value="loose">느슨</option>
                            <option value="medium">중간</option>
                            <option value="strict">엄격</option>
                        </select>
                    </div>
                    <div className="setting-item">
                        <label>테마</label>
                        <select
                            value={settings.theme}
                            onChange={(e) => handleChange("theme", e.target.value)}
                        >
                            <option value="light">라이트모드</option>
                            <option value="dark">다크모드</option>
                        </select>
                    </div>
                    <div className="setting-item">
                        <label>폰트 크기</label>
                        <select
                            value={settings.fontSize}
                            onChange={(e) => handleChange("fontSize", e.target.value)}
                        >
                            <option value="small">작게</option>
                            <option value="medium">보통</option>
                            <option value="large">크게</option>
                        </select>
                    </div>
                    <div className="setting-item">
                        <label>앱 언어</label>
                        <select
                            value={settings.language}
                            onChange={(e) => handleChange("language", e.target.value)}
                        >
                            <option value="ko">한국어</option>
                            <option value="en">English</option>
                        </select>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}