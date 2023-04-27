<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\Category;
use App\Models\User;

class PruebasController extends Controller
{
    //
    public function testOrm() {
        /*
        $publicaciones = Post::all();
        foreach ($publicaciones as $pub){
            echo "<h1>".$pub->title."</h1>";
            echo "<span style='color:gray;'>{$pub->User->name} - {$pub->category->name}</span>";
            echo "<p>".$pub->content."</p>";
            echo  "<hr>";
        }*/
        
        $categorias = Category::all();
        foreach ($categorias as $cat) {
            echo "<h1>{$cat->name}</h1>";
            
            foreach ($cat->posts as $pub){
                echo "<h3>".$pub->title."</h3>";
                echo "<span style='color:gray;'>{$pub->User->name} - {$pub->category->name}</span>";
                echo "<p>".$pub->content."</p>";
               
            }
             echo  "<hr>";
        }
        die();
    }
}
