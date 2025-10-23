declare module "use-dark-mode" {
  interface DarkMode {
    value: boolean;
    enable: () => void;
    disable: () => void;
    toggle: () => void;
  }

  export default function useDarkMode(
    initialValue?: boolean,
    options?: {
      classNameDark?: string;
      classNameLight?: string;
      element?: HTMLElement;
    }
  ): DarkMode;
}
