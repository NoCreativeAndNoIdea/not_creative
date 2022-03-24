import _List from './List'
import { withInstall } from '~/utils/withInstall'
import './list.scss'
export const List = withInstall(_List)
export default List
export type { ListInstance, ListProps } from './type'

declare module 'vue' {
  export interface GlobalComponents {
    List: typeof List
  }
}
