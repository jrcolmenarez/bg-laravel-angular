<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Helpers\JwtAuth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Response;

class UserController extends Controller
{
    public function pruebas(Request $request){
        
        return "Esto es una prueba del User-Controller";
    }
    
    public function register(Request $request) {
                
        //RECOGER DATOS POR POST / JSON
        $json = $request->input('json', null);
        $params = json_decode($json); //obtenemos un objeto
        $params_array = json_decode($json, true);//obtenemos una arreglo
            
        // VALIDAR LOS DATOS, ver documentacion de laravel validation
        if(!empty($params_array)){
            $validate = validator::make($params_array, [
                'name'      => 'required|alpha',
                'surname'   => 'required|alpha',
                'email'     => 'required|email|unique:users',
                'password'  => 'required'
            ]);
            if ($validate->fails()){
                $data = array(
                'status' => 'Error',
                'code'   => 404,
                'message' => 'Usuario no registrado',
                'errors'  => $validate->errors()
                );

                }else{
                    //PASO LA VALIDACION
                    //Vamos a cifrar la contraseña 'cost'=>4 indica que lo cifrare cuatro veces
                    $pwd = hash('sha256',$params->password);
                    /*para validar si el usuario es unico se usa en la validacion
                     * email|unique:users lo cual busca un email repetido en la tabla users
                     */
                    //procedemos a registrar el usuario para ello creamos una instancia de usuario
                    $user = new User();
                    $user->name = $params_array['name'];
                    $user->surname = $params_array['surname'];
                    $user->email = $params_array['email'];
                    $user->password = $pwd;
                    $user->role ='ROLE_USER';
                    //guardar el usuario
                    $user->save();

                    $data = array(
                    'status' => 'success',
                    'code'   => 200,
                    'message' => 'Usuario se ha registrado correctamente',
                    'user' => $user
                    );
                }
        }else {
            $data = array(
                    'status' => 'error',
                    'code'   => 400,
                    'message' => 'LA WEA ESTA VACIA',
                    );
        }
                
        
        
    return response()->json($data, $data['code']);        
    }
    
    public function login(Request $request) {
        
        $jwtAuth = new \App\Helpers\JwtAuth();
        
        //recibir los datos por post
        $json = $request->input('json', null);
        $params = json_decode($json); //obtenemos un objeto
        $params_array = json_decode($json, true);//de esta forma en un arreglo
        
        // validar datos
        $validate = validator::make($params_array, [
            'email'     => 'required|email',
            'password'  => 'required'
        ]);
        if ($validate->fails()){
            $signup = array(
            'status' => 'error',
            'code'   => 404,
            'message' => 'Usuario no se ha podido Identificar faltan datos',
            'errors'  => $validate->errors()
            );
            
            }else{
                //cifrar contraseña
                $pwd = hash('sha256',$params->password);
                $signup = $jwtAuth->signup($params->email, $pwd);
                if(!empty($params->gettoken)){
                    $signup= $jwtAuth->signup($params->email, $pwd, true);
                }
            }
       
                
        return response()->json($signup, 200);
        //return "Usuario logeado";  
    }
    
    public function update(Request $request) {
        
        //comprobar si el usuario esta identificado
        $token = $request->header('Authorization');
        $jwtAuth = new \App\Helpers\JwtAuth();
        $checktoken = $jwtAuth->checkToken($token);
        // recoger los datos por post
        $json = $request->input('json', null);
        $params_array = json_decode($json, true);
        
        if($checktoken && !empty($params_array)){
            
            //actualizar datos del usuario

            
            //sacar el ID (sub) del usuario validado
            $user = $jwtAuth->checkToken($token, true);
            
            //validar datos
            $validate = Validator::make($params_array, [
                'name'      => 'required|alpha',
                'surname'   => 'required|alpha',
                'email'     => 'required|email|unique:users'.$user->sub              
            ]);
            //quitar datos que no necesite
            unset ($params_array['id']);
            unset ($params_array['role']);
            unset ($params_array['password']);
            unset ($params_array['created_at']);
            unset ($params_array['remember_token']);

            //actualizar BBDD
            $user_update = User::where ('id',$user->sub)->update($params_array);
            //devolver array con resultado
            $data = array (
                'code' => 200,
                'status' => 'success',
                'user' => $user,
                'Changes' => $params_array
            );
        }else{
            $data = array (
                'code' => 400,
                'status' => 'error',
                'message' => 'El usuario no identificado'
            );
             //echo "<h1>LOGIN INCORRECTO</h1>";
        
        }
       return response()->json($data, $data['code']);    
    }
    
    public function upload(Request $request){
        //recoger datos de la peticion
        $image = $request->file('file0');
        
        //validar si llega una imagen
        $validate = validator::make($request->all(),[
            'file0' => 'required|image|mimes:jpg,jpeg,png,gif'
        ]);
        
        //gurdamos la imagen
        if(!$image || $validate->fails()){
            
            $data = array (
                'code' => 200,
                'status' => 'error',
                'message' => 'Error al cargar imagen'
             ); 
            
            
        }else {
            $image_name = time().$image->getClientOriginalName();
            Storage::disk('users')->put($image_name, \File::get($image));
           // Storage::disk('user')->put($image_name,);
            $data = array (
            'code' => 200,
            'status' => 'success',
            'image' => $image_name
         ); 

        }
   
        return response()->json($data, $data['code']);
    }
    
    public function getImage($filename) {       
        $isset = Storage::disk('users')->exists($filename);
        
        if($isset){
        //conseguir la imagen
        $file = Storage::disk('users')->get($filename);
        //devolver la imagen
        return new response($file, 200);
        }else {
            $data = [
                'code'  => 404,
                'status'=> 'error',
                'message'=> 'La imagen no existe'
            ];
        }
        return response()->json($data, $data['code']);
    }
    
    public function detail($id) {
        
        $user = User::find($id);
        if(is_object($user)){
            
            $data = array (
                'code' => 200,
                'status' => 'success',
                'user' => $user                
            );
        }else {
             $data = array (
                'code' => 404,
                'status' => 'error',
                'message' => 'usuario no encontrado'                
            );
        }
        return response()->json($data, $data['code']);
    }
    

}
