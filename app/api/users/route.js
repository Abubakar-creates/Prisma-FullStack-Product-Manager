
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();


export async function GET(request) {
  try {
    const product = await prisma.product.findMany();

    if (!product) {
      return NextResponse.json(
        { message: 'No lab exist' },
        { status: 401 },
      );
    }
    const response = NextResponse.json(
      { message: 'labs list successful fetched', data: product },
      { status: 200 },
    );
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Product data:', body);

    const newProduct = await prisma.product.create({
      data: {
        title: body.title,
        price: body.price,
        description: body.description
      }
    });

    const response = {
      message: 'Product created successfully',
      data: newProduct
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error creating product:', error);

    const response = {
      message: 'Internal server error',
      error: error
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    console.log('Updated product data:', body);

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(body.id) },
      data: {
        title: body.title,
        price: body.price,
        description: body.description
      }
    });

    const response = {
      message: 'Product updated successfully',
      data: updatedProduct
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);

    const response = {
      message: 'Internal server error'
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const data = await request.json();
    const newProduct = await prisma.product.delete({
      where: { id: parseInt(data.id) }
    });

    const response = {
      message: 'Product deleted successfully',
      data: newProduct
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error deleting product:', error);

    const response = {
      message: 'Internal server error',
      error: error
    };

    return NextResponse.json(response, { status: 500 });
  }
}