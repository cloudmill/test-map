
function isTouchDevice() {
  return (('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0));
}

document.addEventListener('DOMContentLoaded', () => {
  const pictures = document.querySelectorAll('[data-pin-image]')
  let isTouch = isTouchDevice()

  pictures.forEach(picture => {
    const img = picture.querySelector('img')
    const container = img.closest('[data-pin-container]')
    const offset = {
      top: img.offsetTop,
      left: img.offsetLeft
    }
    let isImageLoaded;
    let imageWidth;
    let imageHeight;
    let isDragging
    let mousePos = { x: null, y: null }

    const imageLoaded = () => {
      imageWidth = img.offsetWidth
      imageHeight = img.offsetHeight
      isImageLoaded = true
    }

    if (img.complete) {
      imageLoaded()
    } else {
      img.addEventListener('load', () => {
        imageLoaded()
      })
    }

    const onMouseDown = (event) => {
      if (isImageLoaded) {
        isDragging = true
        
        if (isTouch) {
          mousePos = { x: event.touches[0].pageX - offset.left, y: event.touches[0].pageY - offset.top }
        } else {
          mousePos = { x: event.pageX - offset.left, y: event.pageY - offset.top }
        }
      }
    }

    const onMouseMove = (event) => {
      if (isDragging) {
        let currentMousePos

        if (isTouch) {
          event.preventDefault()
          currentMousePos = { x: event.touches[0].pageX - offset.left, y: event.touches[0].pageY - offset.top }
        } else {
          currentMousePos = { x: event.pageX - offset.left, y: event.pageY - offset.top }
        }

        const changeX = currentMousePos.x - mousePos.x;
        const changeY = currentMousePos.y - mousePos.y;

        mousePos = currentMousePos

        let imgTop = parseInt($(picture).css('top'), 10);
        let imgLeft = parseInt($(picture).css('left'), 10);
        
        let imgTopNew = imgTop + changeY;
        let imgLeftNew = imgLeft + changeX;

        if(imgTopNew > 0)
          imgTopNew = 0;
        if(imgTopNew < (container.offsetHeight - imageHeight))
          imgTopNew = container.offsetHeight - imageHeight;

        if(imgLeftNew > 0)
        imgLeftNew = 0;
        if(imgLeftNew < (container.offsetWidth - imageWidth))
        imgLeftNew = container.offsetWidth - imageWidth;

        $(picture).css({ top: imgTopNew + 'px', left: imgLeftNew + 'px' });
      }
    }
    
    if (isTouch) {
      container.addEventListener('touchstart', (event) => {
        onMouseDown(event)
      })

      window.addEventListener('touchend', () => {
        isDragging = false
      })
  
      container.addEventListener('touchmove', (event) => {
        onMouseMove(event)
      })
    } else {
      container.addEventListener('mousedown', (event) => {
        onMouseDown(event)
      })

      window.addEventListener('mouseup', () => {
        isDragging = false
      })
  
      container.addEventListener('mousemove', (event) => {
        onMouseMove(event)
      }, { passive: false })
    }
  })
})