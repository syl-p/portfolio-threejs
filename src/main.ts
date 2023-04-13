import './style.css'
import Experience from './Experience/Experience'


const canvas: HTMLElement | null = document.querySelector('#app canvas')
if (canvas) {
  const experience = new Experience(canvas)
}



