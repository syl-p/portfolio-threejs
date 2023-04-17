import './style.css'
import Experience from './Experience/Experience'


const canvas: HTMLElement | null = document.querySelector('#app canvas')
if (canvas) {
  const experience = new Experience(canvas)


  // Observe page sections view
  const sections = document.querySelectorAll('section')
  const callback = (entries, observer) => {
    console.log(entries, observer)
    for (const entrie of entries) {
      console.log(entrie.target.getAttribute('id'), entrie.isIntersecting)
      if (entrie.isIntersecting) {
        experience.sectionEmitter.emit('entered', entrie.target.getAttribute('id'))
      }
    }
  }
   
  if (sections) {
    const observer = new IntersectionObserver(callback, {
      threshold: .5
    })

    sections.forEach(s => {
      observer.observe(s)
    })
  }
}
