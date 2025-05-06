import IMAGES from "../images/images";

export default function Start() {
  return (
    <div className="container startPage">
      <div className="image-wrapper">
        <img src={IMAGES.Bettu} alt="bettu" className="image" />
        <img src={IMAGES.Rabin} alt="raebin" className="image" />
      </div>

      <h2 className="start-title">
        ENJOY STUDYING <br />
        FOREIGN LANGUAGES <br />
        WITH BESTIE TUTOR!
      </h2>

      <p className="start-subTitle">
        나의 외국인 친구이자 학습 러닝 AI인 베스트 튜터와 함께 대화하며<br />
        실생활에서 쓰이는 외국어 회화 능력을 향상시켜요!
      </p>

      {/* subtitle 바로 아래 */}
      <img src={IMAGES.halfcircle} alt="half circle" className="shape halfcircle" />

      {/* 고정 배경 도형들 */}
      <img src={IMAGES.grass} alt="grass" className="shape grass" />
      <img src={IMAGES.rainbow} alt="rainbow" className="shape rainbow" />
    </div>
  );
}