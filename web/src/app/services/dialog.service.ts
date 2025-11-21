import { Injectable, signal, ComponentRef, Type, Injector, createComponent, ApplicationRef, inject } from "@angular/core";

export interface DialogConfig {
  data?: any;
  width?: string;
  disableClose?: boolean;
}

export interface DialogRef<T = any> {
  close(result?: T): void;
  afterClosed(): Promise<T>;
}

@Injectable({
  providedIn: "root",
})
export class DialogService {
  private appRef = inject(ApplicationRef);
  private injector = inject(Injector);
  private openDialogs = signal<ComponentRef<any>[]>([]);

  open<T, R = any>(component: Type<T>, config?: DialogConfig): DialogRef<R> {
    const containerDiv = document.createElement("div");
    containerDiv.className = "modal-overlay";
    document.body.appendChild(containerDiv);

    const componentRef = createComponent(component, {
      environmentInjector: this.appRef.injector,
      elementInjector: this.injector,
    });

    if (config?.data) {
      (componentRef.instance as any).data = config.data;
    }

    this.appRef.attachView(componentRef.hostView);
    containerDiv.appendChild((componentRef.hostView as any).rootNodes[0]);

    let resolvePromise: (value: R) => void;
    const promise = new Promise<R>((resolve) => {
      resolvePromise = resolve;
    });

    const dialogRef: DialogRef<R> = {
      close: (result?: R) => {
        resolvePromise(result as R);
        this.appRef.detachView(componentRef.hostView);
        componentRef.destroy();
        containerDiv.remove();
      },
      afterClosed: () => promise,
    };

    (componentRef.instance as any).dialogRef = dialogRef;

    if (!config?.disableClose) {
      containerDiv.addEventListener("click", (event) => {
        if (event.target === containerDiv) {
          dialogRef.close();
        }
      });
    }

    return dialogRef;
  }
}
