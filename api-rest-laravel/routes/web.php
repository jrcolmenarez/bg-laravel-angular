<?php
namespace App\Http\Controllers;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PruebasController;
//cargando clases middleware
use App\Http\Middleware\ApiAutMiddleware;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/orm',[PruebasController::class, 'testOrm']);

//Rutas de pruebas 
/*Route::get('/usuario/pruebas',[UserController::class, 'pruebas']);
Route::get('/categoria/pruebas',[CategoryController::class, 'pruebas']);
Route::get('/post/pruebas',[PostController::class, 'pruebas']);*/
/* tipos de rutas HHTP mas comunes
 * GET para obtener datos de una web
 * POST: se usa para enviar datos por formulario, guardar datos o recurso
 * PUT: se usa para actualizar datos
 * DELETE: eliminar
 */
//RUTAS PARA EN CONTROLADOR DE USUARIOS

route::post('/api/register',[UserController::class, 'register']);
route::post('/api/login',[UserController::class, 'login']);
route::put('/api/user/update',[UserController::class, 'update']);
route::post('/api/user/upload',[UserController::class, 'upload'])->middleware(ApiAutMiddleware::class);
route::get('/api/user/avatar/{filename}',[UserController::class, 'getImage']);
route::get('/api/user/detail/{id}',[UserController::class, 'detail']);

// RUTAS PARA EN CONTROLADOR LA CATEGORIAS
Route::resource('/api/category', CategoryController::class);

//RUTAS PARA LAS ENTRADAS DEL BLOG
Route::resource('/api/post', PostController::class);
route::post('/api/post/upload',[PostController::class, 'upload']);
route::get('/api/post/image/{filename}',[PostController::class, 'getImage']);
route::get('/api/post/category/{id}',[PostController::class,'getPortsByCategory']);
route::get('/api/post/user/{id}',[PostController::class,'getPostsByUser']);
