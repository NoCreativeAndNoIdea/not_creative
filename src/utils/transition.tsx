import type { TransitionProps, TransitionGroupProps } from 'vue'

export const getTransitionGroupProps = (
  transitionName: string,
  opt: TransitionProps = {}
) => {
  const transitionProps: TransitionGroupProps = transitionName
    ? {
        appear: true,
        // appearFromClass: `${transitionName}-appear ${transitionName}-appear-prepare`,
        appearActiveClass: `${transitionName}`,
        appearToClass: `${transitionName}-appear ${transitionName}-appear-active`,
        enterFromClass: `${transitionName}-appear ${transitionName}-enter ${transitionName}-appear-prepare ${transitionName}-enter-prepare`,
        enterActiveClass: `${transitionName}`,
        enterToClass: `${transitionName}-enter ${transitionName}-appear ${transitionName}-appear-active ${transitionName}-enter-active`,
        leaveActiveClass: `${transitionName} ${transitionName}-leave`,
        leaveToClass: `${transitionName}-leave-active`,
        ...opt,
      }
    : { css: false, ...opt }
  return transitionProps
}
