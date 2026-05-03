import { Metadata } from 'next'
import AboutContent from '../../components/AboutContent'

export const metadata: Metadata = {
  title: 'About Us - Kirti Group | Building Future, Creating Glory',
  description: 'Learn about Kirti Group - a dynamic real estate organization delivering quality developments and reliable consultancy services through Kirti Buildwell, Kirti Real Estate Consultancy, and Kirti Infra Developers.',
}

const AboutPage = () => {
  return <AboutContent />
}

export default AboutPage
