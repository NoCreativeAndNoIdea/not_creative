import _List, { ListProps } from './List'
import { withInstall } from '~/utils/withInstall'

export const List = withInstall(_List)
export default List
export type { ListProps }
export type { ListInstance } from './type'

declare module 'vue' {
  export interface GlobalComponents {
    List: typeof List
  }
}
