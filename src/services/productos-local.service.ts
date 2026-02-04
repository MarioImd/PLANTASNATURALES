import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Producto } from '../util/productos.interfaces';

@Injectable({
    providedIn: 'root'
})
export class ProductosLocalService {

    private productosLocales: Producto[] = [
        // Jabones
        {
            id: 1,
            nombre: 'Jabón BioLine',
            descripcion: 'Jabón reductivo, funciona al disminuir la distensión abdominal, mejora la digestión en general contrarrestando colitis y/o estreñimiento. Óptimo para quienes buscan mejorar su peso y mantener un estilo de vida saludable. Potencializa su acción con cápsulas biorreductivas BiObexx y OBCD.',
            precio: 150.00,
            categoria: 'Corporal Cosmetico',
            stock: 50,
            estado: true,
            creado: new Date().toISOString(),
            actualizado: new Date().toISOString(),
            mercado: 'Local',
            imagen: 'jabon-bioline.jpg',
            ingredientes_activos: 'Fucus vesiculosus, Fucus vesiculosus 1X, Fucus vesiculosus 6cH, Alga marina'
        },
        {
            id: 2,
            nombre: 'Jabón BioText',
            descripcion: 'Jabón para el cuidado de la piel, el favorito de nuestros clientes. Útil desde problemas ligeros de irritación en piel, rozaduras de bebé; control para problemas de acné, barros y espinillas. Fomenta la cicatrización, apoya en procesos de curación de heridas y picaduras de insectos. Previene las estrías durante el embarazo. Trata con manchas de la edad como el paño, ojeras; inclusive previene y corrige arrugas prematuras. Potencializa su acción con crema BioXindol, jabón Gerphyn y cápsulas PharQ.',
            precio: 160.00,
            categoria: 'Corporal Cosmetico',
            stock: 75,
            estado: true,
            creado: new Date().toISOString(),
            actualizado: new Date().toISOString(),
            mercado: 'Local',
            imagen: 'jabon-biotext.jpg',
            ingredientes_activos: 'Caléndula, Miel de abeja 1X, Vitamina E 1X'
        },
        {
            id: 3,
            nombre: 'Jabón BioRelax',
            descripcion: 'Jabón relajante, ideal para días cargados de estrés e insomnio. Mejor calidad de sueño, mejor vigilia, mayor concentración. Mejora la memoria, la coordinación de ideas. Efectos percibidos desde la primera noche de uso.',
            precio: 155.00,
            categoria: 'Corporal Cosmetico',
            stock: 60,
            estado: true,
            creado: new Date().toISOString(),
            actualizado: new Date().toISOString(),
            mercado: 'Local',
            imagen: 'jabon-biorelax.jpg',
            ingredientes_activos: 'Avena 1X Ultradilución, Nux v 200c, Ph ác 200c'
        },
        {
            id: 4,
            nombre: 'Jabón Gerphyn',
            descripcion: 'Controla los gérmenes que general mal humor en piel, en zonas de axilas, pies y aquellas afectadas por el flujo vaginal.',
            precio: 145.00,
            categoria: 'Corporal Cosmetico',
            stock: 40,
            estado: true,
            creado: new Date().toISOString(),
            actualizado: new Date().toISOString(),
            mercado: 'Local',
            imagen: 'jabon-gerphyn.jpg',
            ingredientes_activos: 'Kreosotum 6cH, Echinacea 6X'
        },
        {
            id: 5,
            nombre: 'Jabón Glow',
            descripcion: 'Fortalece y facilita los cuidados para la piel de la persona con diabetes, en especial al prevenir, controlar y tratar el pie diabético.',
            precio: 170.00,
            categoria: 'Corporal Cosmetico',
            stock: 35,
            estado: true,
            creado: new Date().toISOString(),
            actualizado: new Date().toISOString(),
            mercado: 'Local',
            imagen: 'jabon-glow.jpg',
            ingredientes_activos: 'Opuntia ficus-índica 1X, Syzygium 200c'
        },

        // Cremas
        {
            id: 6,
            nombre: 'Crema BioXindol',
            descripcion: 'Otro producto favorito. Auxiliar en control bioanalgésico de dolores corporales como golpes, traumatismos, caídas, infecciones, ciática, pinchazos, inyecciones diversas, luxaciones, contusión, derrames, varices, artritis, lumbalgia, tortícolis, embarazo y parto dolorosos, entre otros.',
            precio: 220.00,
            categoria: 'Corporal Cosmetico',
            stock: 45,
            estado: true,
            creado: new Date().toISOString(),
            actualizado: new Date().toISOString(),
            mercado: 'Local',
            imagen: 'crema-bioxindol.jpg',
            ingredientes_activos: 'Árnica 200c, Hypéricum 200c'
        },
        {
            id: 7,
            nombre: 'Crema Realfirm',
            descripcion: 'Reafirmante. Auxiliar para reafirmar el busto femenino y contribuye a su buena salud.',
            precio: 250.00,
            categoria: 'Corporal Cosmetico',
            stock: 30,
            estado: true,
            creado: new Date().toISOString(),
            actualizado: new Date().toISOString(),
            mercado: 'Local',
            imagen: 'crema-realfirm.jpg',
            ingredientes_activos: 'Sabal serrulata, Colágeno, Vitamina E'
        },

        // Champús
        {
            id: 8,
            nombre: 'Champú BioRVit',
            descripcion: 'Fortalece y revitaliza el cabello más allá de la raíz. En algunos casos renace cabello en folículos que ya estaban improductivos.',
            precio: 180.00,
            categoria: 'Corporal Cosmetico',
            stock: 55,
            estado: true,
            creado: new Date().toISOString(),
            actualizado: new Date().toISOString(),
            mercado: 'Local',
            imagen: 'champu-biorvit.jpg',
            ingredientes_activos: 'Germen de trigo 1X, Baryta carbónica 6cH'
        },
        {
            id: 9,
            nombre: 'Champú Liberty',
            descripcion: 'Auxilia a resolver y prevenir el cabello graso (seborrea). No utilizar en pacientes con implantes dentales y/o con prótesis cardiológicas y/o prótesis óseas.',
            precio: 175.00,
            categoria: 'Corporal Cosmetico',
            stock: 42,
            estado: true,
            creado: new Date().toISOString(),
            actualizado: new Date().toISOString(),
            mercado: 'Local',
            imagen: 'champu-liberty.jpg',
            ingredientes_activos: 'Silicea 6cH, Calcárea phosphórica 6cH'
        },
        {
            id: 10,
            nombre: 'Champú TeraPil',
            descripcion: 'Estimula es cuero cabelludo favoreciendo la producción de cabello. Contiene capsaicina, el componente activo del chile, promoviendo el crecimiento del cabello. Uso sugerido: Alternar el uso de cada champú por periodos de 10 días cada uno.',
            precio: 185.00,
            categoria: 'Corporal Cosmetico',
            stock: 38,
            estado: true,
            creado: new Date().toISOString(),
            actualizado: new Date().toISOString(),
            mercado: 'Local',
            imagen: 'champu-terapil.jpg',
            ingredientes_activos: 'Fel tauri 6cH, Kreosotum 6cH, Cápsicum 6cH'
        },

        // Cápsulas
        {
            id: 11,
            nombre: 'Cápsulas Anabiolgén',
            descripcion: 'Fomenta el aumento de músculo de manera natural',
            precio: 350.00,
            categoria: 'Capsulas',
            stock: 25,
            estado: true,
            creado: new Date().toISOString(),
            actualizado: new Date().toISOString(),
            mercado: 'Local',
            imagen: 'capsulas-anabiolgen.jpg',
            ingredientes_activos: ''
        },
        {
            id: 12,
            nombre: 'Cápsulas PharQ',
            descripcion: 'Auxiliar para disminuir hemorragias en eventos quirúrgicos. Favorece la evolución de tejidos corporales, disminuye el consumo de antiinflamatorios y analgésicos.',
            precio: 380.00,
            categoria: 'Capsulas',
            stock: 20,
            estado: true,
            creado: new Date().toISOString(),
            actualizado: new Date().toISOString(),
            mercado: 'Local',
            imagen: 'capsulas-pharq.jpg',
            ingredientes_activos: 'Phosphorus McH, Hypéricum McH, Caléndula 200cH, Árnica 200cH'
        }
    ];

    constructor() { }

    /**
     * Obtiene todos los productos locales
     */
    getProductosLocales(): Observable<Producto[]> {
        return of(this.productosLocales);
    }

    /**
     * Obtiene un producto por ID
     */
    getProductoById(id: number): Observable<Producto | undefined> {
        const producto = this.productosLocales.find(p => p.id === id);
        return of(producto);
    }

    /**
     * Obtiene productos por categoría
     */
    getProductosByCategoria(categoria: string): Observable<Producto[]> {
        const productos = this.productosLocales.filter(
            p => p.categoria.toLowerCase() === categoria.toLowerCase()
        );
        return of(productos);
    }

    /**
     * Obtiene todas las categorías únicas
     */
    getCategorias(): Observable<string[]> {
        const categorias = [...new Set(this.productosLocales.map(p => p.categoria))];
        return of(categorias);
    }
}
