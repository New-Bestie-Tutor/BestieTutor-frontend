import { useNavigate } from 'react-router-dom';
import { CiCircleCheck } from "react-icons/ci";
import { FaCheck } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useState } from 'react';
import Modal from 'react-modal';
import '../App.css';
import GoBack from '../components/GoBack';

export default function UserAgreement() {
    const navigate = useNavigate();
    const [isChecked, setIsChecked] = useState(false);
    const [isSingleChecked, setSingleChecked] = useState([false, false]);
    const [isAgreementModal, setAgreementModal] = useState(false);

    // 전체 동의 체크박스 클릭 시
    const handleAllCheck = () => {
        const newCheckedState = !isChecked;
        setIsChecked(newCheckedState);
        setSingleChecked([newCheckedState, newCheckedState]);
    };

    // 개별 이용약관 체크박스 상태 업데이트..뭐야 왜 돼?
    const handleSingleCheck = (index) => {
        const updatedSingleChecked = [...isSingleChecked];
        updatedSingleChecked[index] = !updatedSingleChecked[index];
        setSingleChecked(updatedSingleChecked);

        // 전체동의가 개별 체크박스 모두가 체크되었을 때만 활성화되도록 설정
        setIsChecked(updatedSingleChecked.every(Boolean));
    };

    // 내역 보기 클릭
    const openAgreementModal = (index) => {
        setAgreementModal(index);
    };

    // 팝업 닫기
    const closeAgreementModal = () => {
        setAgreementModal(false);
    };


    //다음 버튼 핸들러 - 모두 동의해야 다음 진행
    const handleNext = () => {
        if(!isChecked){
            alert("필수 이용약관에 동의해주세요");
        } else {
            navigate('/register');
        }
    }

    const ModalStyle ={
        overlay: {
            backgroundColor : "rgba(0, 0, 0, 0.5)",
        },
        content: {
            maxWidth: "390px",
            height: "550px",
            margin: "auto",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            padding: "30px",
        },
    };

    const mobileModalStyle = {
        ...ModalStyle,
        content: {
            ...ModalStyle.content,
            width: "390px", 
            margin: "auto",  
            left: "50%",
            transform: "translateX(-50%)",
        }
    };

    return (
        <div className="container">
            <GoBack />
            <h3 className="title agreeTitle">서비스 가입을 위해<br />약관에 동의해주세요</h3>
            
            <p className={`checkbox ${isChecked ? 'checked' : ''}`} onClick={handleAllCheck}>
                <CiCircleCheck className='CiCircleCheck'/>
                <span className='allAgree'>전체동의</span>
            </p>

            <div className='agreement-container'>
                <p className="sub-checkbox">
                    <FaCheck className={`FaCheck ${isSingleChecked[0] ? 'checked' : ''}`} onClick={() => handleSingleCheck(0)}/>
                    <span className='singleAgree'>(필수)Bestie Tutor 서비스 이용약관</span>
                    <span className='agreementDetail' onClick={() => openAgreementModal(0)}>내역보기</span>
                </p>
                <p className="sub-checkbox">
                    <FaCheck className={`FaCheck ${isSingleChecked[1] ? 'checked' : ''}`} onClick={() => handleSingleCheck(1)}/>
                    <span className='singleAgree'>(필수)개인정보 수집 및 이용동의</span>
                    <span className='agreementDetail' onClick={() => openAgreementModal(1)}>내역보기</span>
                </p>
            </div>

            <Modal isOpen={isAgreementModal === 0} onRequestClose={closeAgreementModal} style={window.innerWidth <= 768 ? mobileModalStyle : ModalStyle}>
                <IoIosCloseCircleOutline className='closeModal' onClick={closeAgreementModal}/>
                <div className="modalTitle">
                    <h2>Bestie Tutor 서비스 이용약관</h2>
                    <div className="modalContent">
                    <h2>1. 서비스의 목적</h2>
                    <p>본 서비스는 사용자가 AI와의 대화를 통해 영어 회화 능력을 향상시키기 위한 플랫폼입니다.</p>

                    <h2>2. 이용자 의무</h2>
                    <ul>
                        <li>이용자는 서비스 이용 시 관련 법규를 준수해야 합니다.</li>
                        <li>이용자는 AI와의 대화에서 적절한 언어를 사용해야 하며, 타인의 권리를 침해해서는 안 됩니다.</li>
                        <li>이용자는 서비스의 안전성과 품질을 해치는 행위를 해서는 안 됩니다.</li>
                    </ul>

                    <h2>3. 서비스의 제공</h2>
                    <p>서비스 제공자는 다음과 같은 기능을 제공합니다:</p>
                    <ul>
                        <li>AI 챗봇과의 실시간 영어 회화 연습</li>
                        <li>사용자 맞춤형 회화 로드맵 제공</li>
                        <li>회화 후 피드백 및 학습 결과 제공</li>
                    </ul>

                    <h2>4. 개인정보 보호</h2>
                    <p>이용자의 개인정보는 서비스 이용에 필요한 최소한의 정보만 수집합니다.</p>

                    <h2>5. 약관의 변경</h2>
                    <p>서비스 제공자는 필요에 따라 본 약관을 변경할 수 있으며, 변경 사항은 사전에 공지합니다.</p>

                    <h2>6. 약관 동의</h2>
                    <p>이용자는 본 약관에 동의함으로써 서비스를 이용할 수 있습니다.</p>

                    <h2>7. 문의 사항</h2>
                    <p>서비스에 관한 문의는 하지마시오.</p>
                    </div>
                </div>
            </Modal>
            <Modal isOpen={isAgreementModal === 1} onRequestClose={closeAgreementModal} style={window.innerWidth <= 768 ? mobileModalStyle : ModalStyle}>
                <IoIosCloseCircleOutline className='closeModal' onClick={closeAgreementModal}/>
                <div className="modalTitle">
                    <h2>개인정보 수집 및 이용동의</h2>
                    <div className="modalContent">
                    <p>안녕하세요. 저희 서비스에 관심을 가져주셔서 감사합니다. 본 동의서는 귀하의 개인정보를 수집하고 이용하는 목적 및 방법에 대한 내용을 안내드립니다.</p>

                        <h3>1. 개인정보의 수집 목적</h3>
                        <p>저희는 귀하의 개인정보를 다음과 같은 목적으로 수집합니다:</p>
                        <ul>
                            <li>서비스 제공 및 사용자 인증</li>
                            <li>맞춤형 서비스 제공을 위한 통계 분석 및 마케팅</li>
                            <li>고객 문의 및 불만 처리, 공지사항 전달</li>
                        </ul>

                        <h3>2. 수집하는 개인정보 항목</h3>
                        <p>저희는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다:</p>
                        <ul>
                            <li>필수 항목: 이름, 연락처, 이메일 주소, 생년월일</li>
                            <li>선택 항목: 주소, 직업, 관심사</li>
                        </ul>

                        <h3>3. 개인정보의 보유 및 이용 기간</h3>
                        <p>귀하의 개인정보는 서비스 이용 계약 체결 시부터 해지 후 1년까지 보유합니다. 또한, 관계 법령에 따라 보존할 필요가 있는 경우 해당 법령에서 요구하는 기간 동안 보관됩니다.</p>

                        <h3>4. 개인정보의 제3자 제공</h3>
                        <p>저희는 사용자의 개인정보를 제3자에게 제공하지 않습니다. 단, 법률에 따라 요구되는 경우에는 필요한 최소한의 정보만 제공합니다.</p>

                        <h3>5. 개인정보의 파기 절차 및 방법</h3>
                        <p>이용 목적이 달성되면 즉시 개인정보를 파기하며, 전자적 파일 형태의 정보는 기술적 방법을 이용하여 안전하게 삭제합니다.</p>

                        <h3>6. 동의 거부 권리 및 불이익</h3>
                        <p>사용자는 개인정보 수집 및 이용에 대해 동의하지 않을 권리가 있습니다. 다만, 동의를 거부할 경우 일부 서비스 이용이 제한될 수 있습니다.</p>

                        <p>이 동의서를 충분히 이해하신 후 동의해 주시면 감사하겠습니다.</p>
                    </div>
                </div>
            </Modal>
            <button className="button next" onClick={handleNext}>다음</button>
        </div>
    );
}