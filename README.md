# Segunda entrega del proyecto

- Contarás con Mongo como sistema de persistencia principal.
- Tendrás definidos todos los endpoints para poder trabajar con productos y carritos.

- Profesionalizar las consultas de productos con filtros, paginación y ordenamientos
- Profesionalizar la gestión de carrito para implementar los últimos conceptos vistos.

## How to run the project

```bash
pnpm install
pnpm dev
```

## Test the querys

```bash
Limit: http://localhost:3000/products?limit=3
Page: http://localhost:3000/products?page=2
Query: http://localhost:3000/products?query=shoes
Category: http://localhost:3000/products?category=electronics
Available: http://localhost:3000/products?status=false
Sort desc: http://localhost:3000/products?sort=price:desc
Sort asc: http://localhost:3000/products?sort=price:asc
```
