import { withInstall } from '~/utils/withInstall'
import _IImg from './IImg'
import './iImg.scss'

const IImg = withInstall(_IImg)
export * from './type'

export default IImg

declare module 'vue' {
  export interface GlobalComponents {
    IImg: typeof IImg
  }
}
