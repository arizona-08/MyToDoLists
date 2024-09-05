import "./burgeMenuStyle.css";

interface BurgerMenuProps{
  isActive: boolean;
  OnClick: () => void;
}

function BurgerMenu({isActive, OnClick}: BurgerMenuProps) {
  return (
    <div onClick={OnClick} className="burger-menu">
        <span className={isActive ? "stripe active" : "stripe"}></span>
        <span className={isActive ? "stripe active" : "stripe"}></span>
        <span className={isActive ? "stripe active" : "stripe"}></span>
    </div>
  )
}

export default BurgerMenu