import { Controller,Logger  } from '@nestjs/common';
import { AppService } from './app.service';
import { Users } from './dtos/entity/user.dtos';
import { EventPattern } from '@nestjs/microservices';
import { CreateUserDto } from './dtos/create-user-dto';


@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  
    /////////////////////////////////////////////////////// USUARIOS ///////////////////////////////////////////////////////
    @EventPattern('new_user_created')
    async handleNewUserCreated(newUser: Partial<Users>): Promise<boolean> {
      if (newUser.name && newUser.clave && newUser.correo) {
        const createUserDto: CreateUserDto = {
          name: newUser.name,
          clave: newUser.clave,
          correo: newUser.correo,
        };
        const resp =await this.appService.create(createUserDto);
        
        return resp;
      } else {
        return false;
      }
    }
   
    @EventPattern('update_pass_user')
    async handleUpdatePassUser(data: { oldpass: string, newpass: string, correo: string }) {
      const { oldpass, newpass, correo } = data;
      
      if (oldpass && newpass && correo) {
        const resp = await this.appService.updatePassword(correo,oldpass,newpass)
        return resp;
      } else {
        console.error('Falta INFO.');
      }
    }

    @EventPattern('login_user')
    async handleLoginUserTest(newUser: Partial<Users>) {
      if (newUser.correo && newUser.clave) {
        const { correo, clave } = newUser;
        const user = await this.appService.findUserTest(correo, clave);
        if (user) {
          // Si el usuario existe y las credenciales son válidas, genera un token JWT
          const token = this.appService.generateAccessToken(newUser);
          //console.log(token);
          return token;
        } else {
          //this.logger.error('Credenciales incorrectas');
          return null;
        }
      }
    }

    @EventPattern('show_info_user')
    async handleShowInfoUser(data: { correo: string }) {
      const { correo } = data;
      
      if (correo) {
        const resp = await this.appService.showInfoUser(correo)
        return {
          nombre: resp.nombre,
          correo: resp.correo,
        };
      } else {
        console.error('Falta INFO.');
      }
    }
    
   
    @EventPattern('return_code_user')
    async handleRecoveryCodeUser(data: { correo: string }) {
      const { correo } = data;
      if(correo){
        const resp = await this.appService.recoveryCode(correo)
        return resp
      }
      return "no funciona";
      
    }

    @EventPattern('confirm_pass_user')
    async handleCorfirmCodeUser(data: { correo: string, code:string }) {
      
      const { correo,code } = data;
      if(correo){
        const resp = await this.appService.confirmCode(correo,code)
      
        return resp
      }
      return false;
      
    }

    @EventPattern('update_pass_user2')
    async handleUpdatePassUser2(data: { newpass: string, correo: string }) {
      const { newpass, correo } = data;
      console.log(data)
      if (newpass && correo) {
        const resp = await this.appService.updatePassword2(correo,newpass)
        
        return resp;
      } else {
        console.error('Falta INFO.');
      }
    }
    /////////////////////////////////////////////////////// USUARIOS ///////////////////////////////////////////////////////
    /////////////////////////////////////////////////////// EQUIPOS ///////////////////////////////////////////////////////

    
    @EventPattern('new_equipo_created')
    async handleNewEquipoCreated(data: { nombre: string, correo: string }) {
      const { nombre, correo } = data;
      //console.log(data)
      if (nombre && correo) {
        const resp = await this.appService.createEquipos(nombre,correo)
        return resp;
      } else {
        console.error('Falta INFO1.');
      }
    }

    @EventPattern('show_info_equipo')
    async handleShowInfoEquipo(data: { correo: string }) {
      const { correo } = data;
      
      if (correo) {
        const resp = await this.appService.showInfoEquipo(correo)
        return resp
      } else {
        console.error('Falta INFO.');
      }
    }
    
    @EventPattern('update_name_equipo')
    async handleUpdateNameEquipo(data: { oldName: string,newName: string, correo: string }) {
      const { oldName,newName, correo } = data;
      
      if (oldName && newName && correo) {
        const resp = await this.appService.updateNameEquipo(correo,newName,oldName)
        return resp;
      } else {
        console.error('Falta INFO.');
      }
    }
    @EventPattern('delete_name_equipo')
    async handleDeleteNameEquipo(data: { name: string, correo: string }) {
      const { name, correo } = data;
      
      if (name && correo) {
        const resp = await this.appService.deleteNameEquipo(correo,name)
        return resp;
      } else {
        console.error('Falta INFO.');
      }
    }
    @EventPattern('agregar_integrante')
    async handleAgregarIntegrante(data: { nombreEquipo: string, correoIntegrante: string,correo: string }) {
      const { nombreEquipo, correoIntegrante,correo } = data;
      
      if (nombreEquipo && correoIntegrante) {
        const resp = await this.appService.agregarIntegrante(nombreEquipo,correoIntegrante,correo)
        return resp;
      } else {
        console.error('Falta INFO.');
      }
    }

    @EventPattern('mostrar_integrantes_equipo')
    async handleMostrarIntegrantesEquipo(data: { correo: string,nombreEquipo: string }) {
      
      const resp = await this.appService.mostrarIntegrantes(data.correo,data.nombreEquipo)
      
      return resp;
    }

    @EventPattern('show_info_equipo_proyecto')
    async handleShowInfoEquipoProyecto(data: { idEquipo: string }) {
      const { idEquipo } = data;
      
      if (idEquipo) {
        const resp = await this.appService.showInfoEquipoProyecto(idEquipo)
        return resp
      } else {
        console.error('Falta INFO.');
      }
    }

    @EventPattern('agregar_rol')
    async handleRolIntegrante(data: { correoIntegrante: string, equipoId: number,idRol: number }) {
      const { correoIntegrante, equipoId,idRol } = data;
      
      if (correoIntegrante) {
        const resp = await this.appService.agregarRol(correoIntegrante,equipoId,idRol)
        return resp;
      } else {
        console.error('Falta INFO.');
      }
    }

    
    /////////////////////////////////////////////////////// EQUIPOS ///////////////////////////////////////////////////////
   
  
}

