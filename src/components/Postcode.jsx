import { useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
import { IoIosCloseCircleOutline } from "react-icons/io";
import '../App.css';


function Postcode({onChangeAddress, onChangeAddressDetail}) {
  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [isOpen, setIsOpen] = useState(false);

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
    let address = data.address;
    setAddress(address);
    onChangeAddress(address);
    setIsOpen(false);
  };

  const InputAddressDetail = (event) => {
    setAddressDetail(event.target.value);
    onChangeAddressDetail(event.target.value);
  };

  return (
    <div>
      <div className='address-container'>
        <input id="address" name="address" value={address} className="address" type='text' placeholder='주소를 입력해주세요' onClick={() => setIsOpen(true)} readOnly/>
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

      <input id="addressDetail" name="addressDetail" value={addressDetail} type='text' placeholder='상세주소를 입력해주세요' onChange={InputAddressDetail}/>
    </div>
  );
}

export default Postcode;