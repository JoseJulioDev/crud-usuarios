import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { ErrorDialogComponent } from 'src/app/shared/components/error-dialog/error-dialog.component';

import { Usuario } from '../model/usuario';
import { UsuariosService } from './../service/usuarios.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  usuariosDataSource = new MatTableDataSource<Usuario>();

  displayedColumns = ['nome', 'email', 'actions'];

  constructor(private usuariosService: UsuariosService,
              public dialog: MatDialog,
              private router: Router,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar,) {
      this.refresh();
   }

  onError(errorMsg: string) {
    this.dialog.open(ErrorDialogComponent, {
      data: errorMsg,
    });
  }

  ngOnInit(): void { }

  onAdd() {
    this.router.navigate(['novo'], {relativeTo: this.route});
  }

  onEdit(usuario: Usuario) {
    this.router.navigate(['editar', usuario.id], {relativeTo: this.route});
  }

  onDelete(usuario: Usuario) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: 'Tem certeza que deseja remover esse usuário?',
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.usuariosService.delete(usuario.id).subscribe(
          () => {
            this.refresh();
            this.snackBar.open('Usuário excluído com sucesso!', 'X', {
              duration: 5000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            });
          }, error => {
            this.onError('Erro ao tentar excluir usuário.');
          }
        );
      }
    });
  }

  refresh() {
    this.usuariosService.findAll().pipe(
      tap((usuarios: Usuario[]) => {
        this.usuariosDataSource.data = usuarios;
      })
    ).subscribe(
      () => {},
      (error) => {
        console.error('Erro ao carregar usuários:', error);
        this.usuariosDataSource.data = [];
      }
    );
  }

}
