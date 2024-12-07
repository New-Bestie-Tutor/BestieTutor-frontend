import { useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../UserContext';
import Footer from "../components/Footer"
import Header from "../components/Header"
import DaumPostcode from 'react-daum-postcode';
import { IoIosCloseCircleOutline } from "react-icons/io";
import axios from 'axios';
import '../App.css';

export default function Profile() {
  const navigate = useNavigate();
  const { userInfo } = useContext(UserContext);
  const [user, setUser] = useState({});

const fetchUser = async () => {
    try {
        const userId = userInfo?.userId;
        const response = await axios.get('/user/getUser', {
            params: { userId },
        });
    if (response.status === 200) {
        setUser(response.data);
    } else {
        console.error("userId 불러오는데 실패했습니다.", response.status);
    }
    } catch (error) {
    console.error("API 호출 오류:", error);
    }
};
  
  useEffect(() => {
    if (userInfo?.userId) {
        fetchUser();  
      }
  }, [userInfo]);

  useEffect(() => {
    if (user) {
        setNickname(user.nickname || '');
        setPhone(user.phone || '');
        setEmail(user.email || '');
        setSelectedGender(user.gender || '');
        setAddress(user.address || '');
    }
  }, [user]);

  //초기값 세팅
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isAddressEdit, setIsAddressEdit] = useState(false);
  
  //오류메세지 초기값 세팅
  const [nicknameMessage, setNicknameMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [phoneMessage, setPhoneMessage] = useState('');
  const [emailMessage, setEmailMessage] = useState('이메일은 변경할 수 없습니다.');
  const [genderMessage, setGenderMessage] = useState('');
  const [addressMessage, setaddressMessage] = useState('');
  
  // 유효성 검사
  const [isNickname, setIsNickname] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const isEmail = true;

  const getMessageClass = (isValid) => {
    return isValid ? 'message valid' : 'message invalid';
  };
  
  const onChangeNickname = (e) => {
    const currentNickname = e.target.value;
    setNickname(currentNickname);
    
    if(currentNickname.length < 2 || currentNickname.length > 10){
      setNicknameMessage('닉네임은 2글자 이상 10글자 이하로 입력해주세요.');
      setIsNickname(false);
    } else {
      setNicknameMessage('사용가능한 닉네임입니다.');
      setIsNickname(true);
    }
  };

  const onChangePassword = (e) => {
    const currentPassword = e.target.value;
    setPassword(currentPassword);
    const passwordRegExp =
    /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
    if (!passwordRegExp.test(currentPassword)) {
      setPasswordMessage(
        "숫자+영문자+특수문자 조합으로 8자리 이상 입력해주세요."
      );
      setIsPassword(false);
    } else {
      setPasswordMessage("안전한 비밀번호 입니다.");
      setIsPassword(true);
    }
  };

  const addHyphen = (e) => {
    const currentNumber = e.target.value;
    setPhone(currentNumber);
    if (currentNumber.length == 3 || currentNumber.length == 8) {
      setPhone(currentNumber + "-");
      onChangePhone(currentNumber + "-");
    } else {
      onChangePhone(currentNumber);
    }
  };

  const onChangePhone = (getNumber) => {
    const currentPhone = getNumber;
    setPhone(currentPhone);
    const phoneRegExp = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
    
    if (!phoneRegExp.test(currentPhone)) {
      setPhoneMessage("올바른 형식이 아닙니다.");
      setIsPhone(false);
    } else {
      setPhoneMessage("사용 가능한 번호입니다.");
      setIsPhone(true);
    }
  };

  const handleGender = (gender) => {
    setSelectedGender(gender);
    if(gender === 'male'){
      setGenderMessage('남성을 선택했습니다.');
    } else if(gender === 'female'){
      setGenderMessage('여성을 선택했습니다.');
    } else {
      setGenderMessage('성별을 비공개로 설정했습니다.');
    }
  }

  const themeObj = {
    bgColor: '#FFFFFF', 
    pageBgColor: '#FFFFFF', 
    postcodeTextColor: '#C05850',
    emphTextColor: '#222222',
  };

  const postCodeStyle = {
    width: '360px',
    height: '480px',
  };

  const completeHandler = (data) => {
    setAddress(data.address);
    setIsOpen(false);
    setIsAddressEdit(true);
  };

  const InputAddressDetail = (event) => {
    setAddressDetail(event.target.value);
  };
  
  //다음 버튼 핸들러 - 모두 동의해야 다음 진행
  const handleNext = async () => {
    if ((!isNickname && nickname != user.nickname) || 
        (!isPhone && phone != user.phone)) {
        alert("닉네임이나 전화번호를 정확하게 입력해주세요.");
        return;
    } else if (!isPassword) {
        alert("비밀번호를 정확하게 입력해주세요.");
        return;
    } else if(!selectedGender.trim()) {
      setGenderMessage("성별을 입력해주세요.");
      return;
    } else if(isAddressEdit){
        if(!address.trim() || !addressDetail.trim()) {
          setaddressMessage("모든 주소를 입력해주세요.");
          return;
        }
    } 
    try{
    // 회원가입 함수 호출
    const result = await updateUser();

    // 성공적으로 회원가입이 완료되었는지 확인
    if (result && result.message === '회원정보 수정 성공') {
        navigate('/myPage');
    } else {
        console.error("회원정보 수정에 문제가 발생했습니다.");
    }
    }catch(error){
    console.error("UpdateUser failed:", error);
    }
  };

  async function updateUser() {
    let fullAddress = '';
    if(isAddressEdit){
        fullAddress = address+" "+addressDetail;
    }else{
        fullAddress = address;
    }

    const userData = {
      email: email, 
      password: password,
      nickname: nickname,
      phone: phone,
      gender: selectedGender,
      address: fullAddress
    };

    const response = await axios.put('/user', userData); 
    return response.data;
  }

  return (
    <div className="Home">
        <Header />
        <div className="container profile-container">
            <h2 className="title">회원 정보 수정</h2>
            <form className='registerForm'>
                <label>닉네임 <span className={getMessageClass(isNickname)}>{nicknameMessage}</span> </label>
                <input id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} type='text' placeholder='닉네임을 입력해주세요'/>
                <label>이메일 <span className={getMessageClass(isEmail)}>{emailMessage}</span> </label>
                <input id="email" name="email" value={email} type='text' placeholder='이메일을 입력해주세요' readOnly/>
                <label>비밀번호 <span className={getMessageClass(isPassword)}>{passwordMessage}</span> </label>
                <input id="password" name="password" value={password} onChange={onChangePassword} type='password' placeholder='비밀번호를 입력해주세요'/>
                <label>연락처 <span className={getMessageClass(isPhone)}>{phoneMessage}</span> </label>
                <input id="phone" name="phone" value={phone} onChange={addHyphen} placeholder='연락처를 입력해주세요'/>
                <label>성별 <span className={getMessageClass(selectedGender.trim())}>{genderMessage}</span> </label>
                <div className='gender-container'>
                {['male', 'female', 'hidden'].map(gender => (
                    <button type='button'
                    key={gender}
                    className={`gender ${selectedGender === gender ? 'checked' : ''}`}
                    onClick={() => handleGender(gender)}
                    >
                    {gender === 'male' ? '남성' : gender === 'female' ? '여성' : '비공개'}
                </button>
                ))}
                </div>
                <label>주소 <span className={getMessageClass(address.trim() && addressDetail.trim())}>{addressMessage}</span> </label>
                    <div className='address-container'>
                        <input id="address" name="address" value={address} className="address" type='text' placeholder='주소를 입력해주세요' readOnly/>
                        <button className="addressButton" type='button' onClick={() => setIsOpen(true)}>주소 검색</button>
                    </div>
                    {isOpen && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <IoIosCloseCircleOutline className='closeModal' onClick={() => setIsOpen(false)}/>
                                <DaumPostcode
                                theme={themeObj}
                                style={postCodeStyle}
                                onComplete={completeHandler}
                                onClose={() => setIsOpen(false)}
                                />
                            </div>
                        </div>
                    )}
                    {isAddressEdit && (
                        <input id="addressDetail" name="addressDetail" value={addressDetail} type='text' placeholder='상세주소를 입력해주세요' onChange={InputAddressDetail}/>
                    )}
            </form>
            <button type='button' className="button next" onClick={handleNext}>수정 완료</button>
        </div>
    <Footer />
    </div>
  );
}