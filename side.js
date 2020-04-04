const grid = document.querySelector('.grid');
const imageGrid = document.querySelector('.grid__imagewrap');
const images = imageGrid.querySelectorAll('.grid__image');
const textGrid = document.querySelector('.grid__textwrap');
const textList = document.querySelectorAll('.grid__text span');

const imageGridWidth = 3500;
let thres = imageGridWidth - window.innerWidth;
let transX = 0;

window.addEventListener('resize', () => {
  thres = imageGridWidth - window.innerWidth;
})

grid.addEventListener('wheel', e => {
  if (transX >= 100) transX = 0;
  if (transX <= -thres) transX = -thres;
  const delta = Math.sign(e.deltaY);
  
  
  TweenMax.to(imageGrid, 0.5, { x: transX += delta * 100 });
  TweenMax.to(textGrid, 0.5, { x: transX * 1.03});
});

class Item {
  constructor(el) {
    this.DOM = { el: el };
    this.DOM.grid = document.querySelector('.grid');
    this.DOM.number = this.DOM.el.querySelector('.grid__number span');
    this.state = {
      isExpanded: false,
      isCloned: false
    };
    
    this.onClick = this.onClick.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.expandToggle = this.expandToggle.bind(this);
    this.bindEvents();
  }
  
  bindEvents() {
    this.DOM.el.addEventListener('click', this.onClick);
    this.DOM.el.addEventListener('mousemove', this.onMouseMove);
  }
  
  onMouseMove(e) {
    // console.log('mousemove')
  }
  
  onClick() {
    this.cloneItem();
    setTimeout(() => this.expandToggle(), 10);
  }
  
  cloneItem() {
    if (this.state.isCloned) return;
    this.state.isCloned = true;
    this.DOM.itemClone = this.DOM.el.cloneNode();
    Object.assign(this.DOM.itemClone.style, {
      position: 'absolute',
      margin: 0,
      top: `${this.DOM.el.getBoundingClientRect().top}px`,
      left: `${this.DOM.el.offsetLeft + transX}px`
    });
    this.DOM.grid.appendChild(this.DOM.itemClone);

    this.DOM.itemClone.addEventListener('click', this.expandToggle);
  }
  
  expandToggle() {
    const tl = new TimelineMax();
    
    if (!this.state.isExpanded) {
      this.state.isExpanded = true;
      tl.staggerTo(Array.from(textList), 1, { y: 150, ease: Power3.easeInOut });
      tl.to(this.DOM.number, 0.5, { x: 100, ease: Power3.easeInOut }, '-=0.7');
      tl.to(this.DOM.itemClone, 0.5, {
        width: `${window.innerWidth}px`,
        height: `${window.innerHeight}px`,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 10
      });
    }
    else {
      this.state.isExpanded = false;
      tl.to(this.DOM.itemClone, 0.5, {
        width: `${this.DOM.el.offsetWidth}px`,
        height: `${this.DOM.el.offsetHeight}px`,
        top: `${this.DOM.el.getBoundingClientRect().top}px`,
        left: `${this.DOM.el.offsetLeft + transX}px`,
        zIndex: 1
      });
      tl.staggerTo(Array.from(textList), 1, { y: 0, ease: Back.easeOut.config(1) });
      tl.to(this.DOM.number, 0.5, { x: 0, ease: Power3.easeOut }, '-=0.7');
      
      setTimeout(() => {
        this.DOM.itemClone.removeEventListener('click', this.expandToggle);
        this.DOM.grid.removeChild(this.DOM.itemClone);
        this.state.isCloned = false;
      }, 500);
    }
  }
}

images.forEach(el => new Item(el));
