import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { UsuariosService } from '../service/usuarios.service';


const senhaValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {

  const senha = control.get('senha');
  const confirmacaoSenha = control.get('confirmacaoSenha');

  if (senha?.invalid || confirmacaoSenha?.invalid) {
    return null;
  }

  return confirmacaoSenha?.value == senha?.value ? null : {senhaInvalida: true};
};


@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent implements OnInit {

  titulo = 'Cadastrando usuário';

  form: FormGroup = this.formBuilder.group(
    {
      id: [null],
      nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: [null, [Validators.required, Validators.email]],
      senha: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      confirmacaoSenha: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(20)]]
    }, {validators: senhaValidator});

  constructor(private formBuilder: FormBuilder,
              private usuarioService: UsuariosService,
              private snackBar: MatSnackBar,
              private location: Location,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( (params: ParamMap) => {
      const id = params.get('id');

      if (id != null) {
          this.usuarioService.findById(id).subscribe(
            result => {
              this.titulo = `Editando usuário ${result.nome}`;
              this.form.patchValue(result);

              this.form.controls.senha.clearValidators();
              this.form.controls.senha.reset();
              this.form.controls.confirmacaoSenha.clearValidators();
              this.form.controls.confirmacaoSenha.reset();
              this.form.clearValidators();
            }
          );
      }
    });

  }

  onSubmit() {
    this.usuarioService.save(this.form.value)
        .subscribe(result => this.onSuccess(), error => this.onError());
  }

  private onSuccess() {
    this.snackBar.open('Usuário cadastrado com sucesso!', '', { duration: 5000 });
    this.onCancel();
  }

  private onError() {
    this.snackBar.open('Erro ao cadastrar usuário.', '', { duration: 5000 });
  }

  onCancel() {
    this.location.back();
  }

  getErrorMessage(fieldName: string) {
    const field = this.form.get(fieldName);

    if (field?.hasError('required')) {
        return `Campo  ${fieldName} é obrigatório`;
    }

    if (field?.hasError('email')) {
      return `Email Inválido`;
  }

    if (fieldName == 'nome') {
      if (field?.hasError('minlength')) {
        const requiredLength: number = field.errors ? field.errors['minlength']['requiredLength'] : 3;
        return `O tamanho mínimo do campo nome é ${requiredLength} caracteres.`;
      }

      if (field?.hasError('maxlength')) {
        const requiredLength: number = field.errors ? field.errors['maxlength']['requiredLength'] : 50;
        return `Tamanho máximo do campo nome é ${requiredLength} caracteres.`;
      }
    }


    if (fieldName == 'senha' || fieldName == 'confirmacaoSenha') {
      if (field?.hasError('minlength')) {
        const requiredLength: number = field.errors ? field.errors['minlength']['requiredLength'] : 6;
        return `O tamanho mínimo do campo ${fieldName} é ${requiredLength} caracteres.`;
      }

      if (field?.hasError('maxlength')) {
        const requiredLength: number = field.errors ? field.errors['maxlength']['requiredLength'] : 20;
        return `Tamanho máximo do campo ${fieldName} é ${requiredLength} caracteres.`;
      }
    }

    return `Campo ${fieldName} Inválido`;

  }


}
