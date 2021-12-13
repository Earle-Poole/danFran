import CoverPhoto from '@/components/atoms/CoverPhoto/CoverPhoto'

const HomeTemplate = () => {
  return (
    <div className='w-full flex flex-col items-center'>
      <CoverPhoto />
      <div className='w-full max-w-7xl flex flex-col items-center'>
        <div className='h-96 w-full'>Home Template</div>
        <div className='h-96 w-full'>Home Template</div>
        <div className='h-96 w-full'>Home Template</div>
      </div>
    </div>
  )
}

export default HomeTemplate
