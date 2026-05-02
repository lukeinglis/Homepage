import { Component, type ComponentChildren } from "preact";

interface Props {
  name: string;
  children: ComponentChildren;
}

interface State {
  hasError: boolean;
}

export class WidgetWrapper extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    console.error(`Widget "${this.props.name}" failed to render:`, error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div class="widget-error" role="alert">
          <p>Widget unavailable</p>
        </div>
      );
    }
    return this.props.children;
  }
}
