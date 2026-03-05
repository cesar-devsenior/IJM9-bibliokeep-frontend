import { TestBed } from "@angular/core/testing";
import { Login } from "./login";

describe('Login', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Login],
        }).compileComponents();
    });

    it("Should create the login component", () => {
        const fixture = TestBed.createComponent(Login);
        const login = fixture.componentInstance;
        expect(login).toBeTruthy();
    });

    it("Should show login form if user is not authenticated", async () => {
        const fixture = TestBed.createComponent(Login);
        await fixture.whenStable();

        const compiled = fixture.nativeElement as HTMLElement;

        const inputs = compiled.getElementsByTagName('input');

        expect(inputs.length).toBe(2);
    });

    it("Should redirect if user is already authenticated", () => {
        const fixture = TestBed.createComponent(Login);
        const component = fixture.componentInstance;

        // Espía el método isAuthenticated para simular usuario autenticado
        const storage = (component as any).storage;
        vi.spyOn(storage, 'isAuthenticated').mockReturnValue(true);

        // Espía el router para verificar la redirección
        const router = (component as any).router;
        const navigateSpy = vi.spyOn(router, 'navigateByUrl');

        // Ejecutar ngOnInit (ciclo de vida)
        component.ngOnInit();

        expect(storage.isAuthenticated).toHaveBeenCalled();
        expect(navigateSpy).toHaveBeenCalledWith('/dashboard');
    });

    it('should not submit if the form is invalid', () => {
        const fixture = TestBed.createComponent(Login);
        const component = fixture.componentInstance;

        // Marcamos campos inválidos explícitamente
        component.form.patchValue({ email: '', password: '' }); // ambos vacíos => inválido

        // Espía submitting y errorMessage
        const submittingSpy = vi.spyOn(component.submitting, 'set');
        const errorMessageSpy = vi.spyOn(component.errorMessage, 'set');

        // Espía el login del AuthService
        const auth = (component as any).auth;
        const loginSpy = vi.spyOn(auth, 'login');

        // Espía markAllAsTouched del formulario
        const markAllTouchedSpy = vi.spyOn(component.form, 'markAllAsTouched');

        component.onSubmit();

        expect(errorMessageSpy).toHaveBeenCalledWith(null); // deberia limpiar error antes
        expect(markAllTouchedSpy).toHaveBeenCalled();
        expect(submittingSpy).not.toHaveBeenCalledWith(true);
        expect(loginSpy).not.toHaveBeenCalled();
    });

    it('should submit when the form is valid and handle successful login', () => {
        const fixture = TestBed.createComponent(Login);
        const component = fixture.componentInstance;

        // Valores válidos para el formulario
        component.form.patchValue({ email: 'user@email.com', password: '123456' });
        component.form.markAsDirty();
        component.form.markAsTouched();

        // Espías a las señales y dependencias
        const submittingSpy = vi.spyOn(component.submitting, 'set');
        const errorMessageSpy = vi.spyOn(component.errorMessage, 'set');
        const auth = (component as any).auth;
        const router = (component as any).router;

        // Mock del login para devolver un observable que completa (simulando éxito)
        const mockObservable = {
            subscribe: ({ next }: any) => {
                next();
                return { unsubscribe: () => { } };
            }
        };
        const loginSpy = vi.spyOn(auth, 'login').mockReturnValue(mockObservable as any);
        const navigateSpy = vi.spyOn(router, 'navigateByUrl');

        component.onSubmit();

        expect(errorMessageSpy).toHaveBeenCalledWith(null);  // limpia error al iniciar submit
        expect(submittingSpy).toHaveBeenCalledWith(true);    // cambia a "enviando"
        expect(loginSpy).toHaveBeenCalledWith({ email: 'user@email.com', password: '123456' });
        expect(submittingSpy).toHaveBeenCalledWith(false);   // cambia a "no enviando" al terminar
        expect(errorMessageSpy).toHaveBeenCalledWith(null);  // no hay error si fue exitoso
        expect(navigateSpy).toHaveBeenCalledWith('/dashboard'); // navega al dashboard
    });

    it('should handle error when the form is valid but login fails and display error message in template', () => {
        const fixture = TestBed.createComponent(Login);
        const component = fixture.componentInstance;

        // Patch con valores válidos
        component.form.patchValue({ email: 'user@email.com', password: '123456' });
        component.form.markAsDirty();
        component.form.markAsTouched();

        // Espías a señales y dependencias
        const submittingSpy = vi.spyOn(component.submitting, 'set');
        const errorMessageSpy = vi.spyOn(component.errorMessage, 'set');
        const auth = (component as any).auth;

        // Observable simula error de backend en login
        const mockObservable = {
            subscribe: ({ next, error }: any) => {
                error({ error: new Error('Credenciales inválidas') });
                return { unsubscribe: () => { } };
            }
        };
        const loginSpy = vi.spyOn(auth, 'login').mockReturnValue(mockObservable as any);

        // Ejecuta submit
        component.onSubmit();

        expect(errorMessageSpy).toHaveBeenCalledWith(null);         // limpia error al iniciar submit
        expect(submittingSpy).toHaveBeenCalledWith(true);           // inicia submit
        expect(loginSpy).toHaveBeenCalledWith({ email: 'user@email.com', password: '123456' });
        expect(submittingSpy).toHaveBeenCalledWith(false);          // termina submit
        expect(errorMessageSpy).toHaveBeenCalledWith('Credenciales inválidas'); // muestra error

        // Renderiza plantilla y valida mensaje de error visible
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain('Credenciales inválidas');
    });

    it('should call onSubmit when submitting the form via the template and show correct submit button state', () => {
        const fixture = TestBed.createComponent(Login);
        const component = fixture.componentInstance;
        fixture.detectChanges();

        // Patch with valid values
        component.form.patchValue({ email: 'user@email.com', password: '123456' });
        fixture.detectChanges();

        // Spy on onSubmit
        const submitSpy = vi.spyOn(component, 'onSubmit').mockImplementation(() => {
            // simulate async action
            component.submitting.set(true);
            fixture.detectChanges();
            // simulate end of submit
            setTimeout(() => {
                component.submitting.set(false);
                fixture.detectChanges();
            }, 0);
        });

        // Find submit button before submit
        const submitButton: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
        expect(submitButton).toBeTruthy();
        expect(submitButton.disabled).toBe(false);

        // Submit the form through the template
        const form: HTMLFormElement = fixture.nativeElement.querySelector('form');
        form.dispatchEvent(new Event('submit'));
        fixture.detectChanges();

        expect(submitSpy).toHaveBeenCalled();

        // Simulate submitting state on button label (should show loading or disabled)
        component.submitting.set(true);
        fixture.detectChanges();

        expect(submitButton.disabled).toBe(true);
        expect(submitButton.textContent).toBe("Ingresando...");

        // Simulate finished state
        component.submitting.set(false);
        fixture.detectChanges();

        expect(submitButton.disabled).toBe(false);
        expect(submitButton.textContent).toBe("Ingresar");
    });

});