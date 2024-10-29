import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import Postcode from '../components/Postcode';
import GoBack from '../components/GoBack';
import '../App.css';

export default function Register() {
  const navigate = useNavigate();
  // 필수 입력 : password, nickname, phone, email, gender, address
  //초기값 세팅
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  
  // Postcode에서 주소 값 가져오기
  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');

  const addressChangeHandler = (newAddress) => {
    setAddress(newAddress);
  }
  const addressDetailChangeHandler = (newAddressDetail) => {
    setAddressDetail(newAddressDetail);
  }
  //오류메세지 초기값 세팅
  const [nicknameMessage, setNicknameMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [phoneMessage, setPhoneMessage] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [genderMessage, setGenderMessage] = useState('');
  const [addressMessage, setaddressMessage] = useState('');
  
  // 유효성 검사
  const [isNickname, setIsNickname] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const [isEmail, setIsEmail] = useState(false);
  // const [isSelectedGender, setIsSelectedGender] = useState(false);
  // const [isAddress, setIsAddress] = useState(false);
  // const [isAddressDetail, setIsAddressDetail] = useState(false);
  
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

  const onChangeEmail = (e) => {
    const currentEmail = e.target.value;
    setEmail(currentEmail);
    const emailRegExp =
    /^[A-Za-z0-9_]+[A-Za-z0-9]*[@]{1}[A-Za-z0-9]+[A-Za-z0-9]*[.]{1}[A-Za-z]{1,3}$/;
    
    if (!emailRegExp.test(currentEmail)) {
      setEmailMessage("이메일의 형식이 올바르지 않습니다.");
      setIsEmail(false);
    } else {
      setEmailMessage("사용 가능한 이메일 입니다.");
      setIsEmail(true);
    }
  };

  //다음 버튼 핸들러 - 모두 동의해야 다음 진행
  const handleNext = async () => {
    if(!isNickname||!isPassword||!isPhone||!isEmail){
      alert("모든 정보를 입력해주세요.");
    } else if(!selectedGender.trim()) {
      setGenderMessage("성별을 입력해주세요.");
    } else if(!address.trim()) {
      setaddressMessage("주소를 입력해주세요.")
    } else if(!addressDetail.trim()) {
      setaddressMessage("상세 주소를 입력해주세요.")
    } else {
      // alert("회원가입을 축하드립니다.");
      // navigate('/registrationSuccess');
      try{
        await register();
      }catch(error){
        console.error("Registration failed:", error);
      }
    }
  };

  async function register() {
    console.log('Register function is called');
    const fullAddress = address+" "+addressDetail;
    const userData = {
      email: email, 
      password: password,
      nickname: nickname,
      phone: phone,
      gender: selectedGender,
      address: fullAddress,
    };
    const response = await axios.post('/user', userData);
    console.log("Registration response:", response.data);
    return response.data;
  }

  return (
    <div className="container">
      <GoBack />
      <h2 className="title">회원가입</h2>
      <form className='registerForm'>
        <label>닉네임 <span className="message">{nicknameMessage}</span> </label>
        <input id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} type='text' placeholder='닉네임을 입력해주세요'/>
        <label>이메일 <span className="message">{emailMessage}</span> </label>
        <input id="email" name="email" value={email} onChange={onChangeEmail} type='text' placeholder='이메일을 입력해주세요'/>
        <label>비밀번호 <span className="message">{passwordMessage}</span> </label>
        <input id="password" name="password" value={password} onChange={onChangePassword} type='password' placeholder='비밀번호를 입력해주세요'/>
        <label>연락처 <span className="message">{phoneMessage}</span> </label>
        <input id="phone" name="phone" value={phone} onChange={addHyphen} placeholder='연락처를 입력해주세요'/>
        <label>성별 <span className="message">{genderMessage}</span> </label>
        <div className='gender-container'>
          {['male', 'female', 'hidden'].map(gender => (
            <button type='button'
            key={gender}
            className={`button gender ${selectedGender === gender ? 'checked' : ''}`}
            onClick={() => setSelectedGender(gender)}
            >
            {gender === 'male' ? '남성' : gender === 'female' ? '여성' : '비공개'}
          </button>
        ))}
        </div>
        <label>주소 <span className="message">{addressMessage}</span> </label>
        <Postcode onChangeAddress={addressChangeHandler} onChangeAddressDetail={addressDetailChangeHandler}/>
      </form>
      <button type='button' className="button next" onClick={handleNext}>계정 생성</button>
      <p className='goLogin'>계정이 이미 있으신가요? <span onClick={() => navigate('/login')}>로그인하기</span></p>
    </div>
  );
}