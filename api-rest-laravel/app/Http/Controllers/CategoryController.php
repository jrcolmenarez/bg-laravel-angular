<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Category;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    //llamamos el middlware para confirmar inicio de sesion desde aca y no de la ruta
    //esto para que solo una funcion la use y no todas
    public function __construct() {
        
        $this->middleware('api.auth', ['except' => ['index','show']]);
        
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $categories = Category::all();
        return response()->json([
            'code'      => 200,
            'status'    => 'success',
            'categories'=> $categories
        ]);
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
        //recoger los datos por post
        $json = $request->input('json',null);
        $params_array = json_decode($json, true);
        
        //validamos que no este vacio
        if(!empty($params_array)){
            
            //validacion
            $validate = Validator::make($params_array, [
                'name' => 'required'
            ]);

            //Guardar Categoria
            if($validate->fails()){
                $data = [
                    'code'  => 400,
                    'status'=>'error',
                    'message'=>'no se ha podido guardar'
                ];
            }else{
                $category = new Category();
                $category->name = $params_array['name'];
                $category->save();
                $data = [
                    'code'  => 200,
                    'status'=>'success',
                    'category'=> $category
                ];
            }
        }else{
            $data = [
                    'code'  => 400,
                    'status'=>'error',
                    'message'=>'no se ha enviado nada'
                ];
        }
        //devolver resultado
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
        $category = Category::find($id);
        if(is_object($category)){
            $data = [
                'code'      => 200,
                'status'    => 'success',
                'category'=> $category
            ];
        }else {
            $data = [
                'code'      => 404,
                'status'    => 'error',
                'mesage'=> 'La categoria no existe'
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
        
        $json = $request->input('json', null);
        $params_array = json_decode($json, true);
        
        if(!empty($params_array)){
            
        //validar los datos
        
        $validate = Validator::make($params_array, [
            'name' => 'required'
        ]);    
        //quitar lo que no quiero actualizar
        unset($params_array['id']);
        unset($params_array['created_at']);
        //actualizar registros
        $category = Category::where('id', $id)->update($params_array);
        
        $data = [
            'code'      => 200,
            'status'    => 'success',
            'mesage'=> 'SE HA ACTUALIZADO',
            'category' => $params_array
            ];
        
        }else{
                $data = [
                'code'      => 404,
                'status'    => 'error',
                'mesage'=> 'NO SE HA PODIDO ACTUALIZAR CATEGORIA'
            ];
            }
        
        //devolver los datos
        return response()->json($data, $data['code']); 
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
