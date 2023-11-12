import { Location } from '@angular/common';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';

import { Usuario } from '../model/usuario';
import { UsuariosService } from '../service/usuarios.service';
import { UsuarioFormComponent } from './usuario-form.component';

class ActivatedRouteStub {
  snapshot = {
    paramMap: jasmine.createSpyObj<ParamMap>('ParamMap', ['get'])
  };
  data = of({ data: {} });
  paramMap = of({
    get: (key: string) => {
      return '1';
    }
  });
}

describe('UsuarioFormComponent', () => {
  let component: UsuarioFormComponent;
  let fixture: ComponentFixture<UsuarioFormComponent>;
  let mockUsuariosService: jasmine.SpyObj<UsuariosService>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockLocation: jasmine.SpyObj<Location>;
  let mockActivatedRoute: ActivatedRouteStub;

  beforeEach(waitForAsync(() => {
    mockUsuariosService = jasmine.createSpyObj('UsuariosService', ['save']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockLocation = jasmine.createSpyObj('Location', ['back']);

    mockActivatedRoute = new ActivatedRouteStub();

    TestBed.configureTestingModule({
      declarations: [UsuarioFormComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: UsuariosService, useValue: mockUsuariosService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: Location, useValue: mockLocation },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve enviar o formulário e acionar o onSuccess', () => {
    const usuario = {
      id: '1',
      nome: 'Test',
      email: 'test@email.com',
      senha: 'senha',
      confirmacaoSenha: 'senha',
    };
    component.form.setValue(usuario);
    mockUsuariosService.save.and.returnValue(of(usuario as Usuario));

    component.onSubmit();

    expect(mockSnackBar.open).toHaveBeenCalledWith('Usuário cadastrado com sucesso!', '', { duration: 5000 });
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('deve tratar o erro e enviar ao formulário', () => {
    const usuario = {
      id: '1',
      nome: 'Test',
      email: 'test@email.com',
      senha: 'senha',
      confirmacaoSenha: 'senha',
    };
    component.form.setValue(usuario);
    mockUsuariosService.save.and.returnValue(throwError('Error'));

    component.onSubmit();

    expect(mockSnackBar.open).toHaveBeenCalledWith('Erro ao cadastrar usuário.', '', { duration: 5000 });
  });
});
