<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use Illuminate\Http\Response;
use App\Helpers\JwtAuth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    
    public function __construct() {
        
        $this->middleware('api.auth',['except'=>[
            'index',
            'show',
            'getImage',
            'getPortsByCategory',
            'getPostsByUser']]);
        
    }
    
    public function index()
    {
        //load y asociamos el nombre del modelo 'category' se usa para cargar ademas la caetgoria asociada al post
        $post = Post::all()->load('category')
                            ->load('user');
        return response()->json([
            'code'      => 200,
            'status'    => 'success',
            'post'      => $post
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        
        //Recoger datos por el post
        $json = $request->input('json', null);
        $params = json_decode($json);
        $params_array = json_decode($json, true); 
        if(!empty($params_array)){
            //conseguir usuario verificado
            $user = $this->getIdentity($request);
            //validar los datos
            $validate = Validator::make($params_array, [
                'title' => 'required',
                'content' => 'required',
                'category_id' => 'required',
                'image' => 'required'
            ]);
            if($validate->fails()){
                $data = [
                    'code' => 400,
                    'status' =>'error',
                    'message' => 'Falta informacion para guardar post BANDERA'
                ];
            }else{
                //guardar el post
                $post = new Post;
                $post->user_id=$user->sub;
                $post->category_id = $params->category_id;
                $post->title = $params->title;
                $post->content =  $params->content;
                $post->image = $params->image;
                $post->save();
                $data = [
                    'code' => 200,
                    'status' =>'success',
                    'post' => $post
                ];
            }

            
        }else{
                $data = [
                    'code' => 400,
                    'status' =>'error',
                    'message' => 'Falta informacion para guardar post, no hay params array'
                ];
            
        }
        //devolver repuesta
        return response()->json($data, $data['code']);
    }
    

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $post = Post::find($id)->load('category')
                                ->load('user');
        if(is_object($post)){
            $data = [
                'code'      => 200,
                'status'    => 'success',
                'post'      => $post
        ];
        }else{
            $data = [
                'code'      => 400,
                'status'    => 'Error',
                'mesage'      => 'Error Id no existe '
        ];
        }
        return response()->json($data, $data['code']);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //recoger los datos por post
        $json=$request->input('json', null);
        $params_array=json_decode($json, true);
        
        //datos para devolver 
        $data = array(
                'code'  => 400,
                'status'=> 'Error',
                'message'=> 'No se han enviado datos para actualizar'
        );

        //validar los datos
        if(!empty($params_array)){
            $validate = Validator::make($params_array, [
                'title'     => 'required',
                'content'   => 'required',
                'category_id'=> 'required'
            ]);
            if($validate->fails()){
                $data['errors'] = $validate->errors();
                return response()->json($data, $data['code']);
            }
            //eliminar lo que no queremos actualizar
            unset($params_array['id']);
            unset($params_array['user_id']);
            unset($params_array['created_at']);
            unset($params_array['user']);
            
           //conseguir usuario verificado
            $user = $this->getIdentity($request);
            
            //buscamos el post que coincida con el id usuario
            $post = Post::where('id',$id)
                    ->where('user_id',$user->sub)
                    ->first();
            //si consigue alguna coincidencia actualizamos
            if(!empty($post) && is_object($post)){
                //actualizar el registro concreto
                $post->update($params_array);
                //devolvemos 
                $data = array (
                    'code'      => 200,
                    'status'    => 'success',
                    'Post'      => $post,
                    'changes'   => $params_array
                    );
            }
            /*$where = [
                'id' => $id,
                'user_id' => $user->sub
            ];
            $post = Post::updateorcreate($where, $params_array);
            */
        }
        return response()->json($data, $data['code']);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id, Request $request)
    {

        $post = new Post();
        $user = $this->getIdentity($request);
        //conseguir el registro
        $post = Post::where('id',$id)
                    ->where('user_id',$user->sub)
                    ->first();
        if(!empty($post)){
            //Borrarlo
             $post->delete();

             //devolver datos
             $data = array(
               'code'    =>  200,
               'status'  => 'success',
               'post'    => $post
             );
        }else{
            $data = array(
               'code'    =>  404,
               'status'  => 'error',
               'mesage'    => 'Post no existe'
             );
        }
        return response()->json($data, $data['code']);
               
    }
    private function getIdentity(Request $request){
        //creamos una instancia 
        $jwtauth = new JwtAuth();//creamos instancia para saber usar metodo check token
        $token = $request->header('Authorization', null);//sacar token del header
        $user = $jwtauth->checkToken($token, true);//verificar si es el mismo del iniciado
        return $user;
    }
    
    public function upload(Request $request) {
        //recoger la imagen de la peticion
        $image = $request->file('file0');
        //validar una imagen
        $validate = validator::make($request->all(),[
            'file0' => 'required|image|mimes:jpg,jpeg,png,gif'
        ]);
        //guardarla en un disco
        if(!$image || $validate->fails()){
            
            $data = array (
                'code' => 400,
                'status' => 'error',
                'message' => 'Error al cargar imagen'
             ); 
         }else {
            $image_name = time().$image->getClientOriginalName();
            Storage::disk('images')->put($image_name, \File::get($image));
           // Storage::disk('user')->put($image_name,);
            $data = array (
                'code' => 200,
                'status' => 'success',
                'image' => $image_name
             ); 
         }
         //devolver los datos
         return response()->json($data, $data['code']);
    }
    public function getImage($filename){
        //comprobar si existe el fichero
        $isset = Storage::disk('images')->exists($filename);
        
        if($isset){
        //conseguir la imagen
        $file = Storage::disk('images')->get($filename);
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
    public function getPortsByCategory($id){
        
        //obtener los post por categoria
        $posts= Post::where ('category_id', $id)->get();
        return response()->json([
            'status'    => 'success',
            'post'      => $posts
        ],200);
        
    }
    
    public function getPostsByUser($id) {

        //obtener los post por Usuario
        $posts= Post::where ('user_id', $id)->get();
        return response()->json([
            'status'    => 'success',
            'post'      => $posts
        ],200);
    }
    
}
