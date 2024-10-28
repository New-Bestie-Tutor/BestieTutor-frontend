import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa6";

export default function GoBack() {
    const navigate = useNavigate();
    // 뒤로 가기 핸들러
    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <p className="goBack" onClick={handleGoBack}>
          <FaArrowLeft className='goBackArrow'/>
        </p>
    )
}