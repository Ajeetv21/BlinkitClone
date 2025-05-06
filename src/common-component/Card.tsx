import Image from 'next/image';


export default function Card({ image, title, description,price }:any) {
  return (
    <div className='w-full max-w-sm bg-white rounded-xl'>
      <Image
       src={image}
       alt={title}
       width={200}
       height={200}

      />
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
        <p>{price}</p>
      </div>
    </div>
  );
}
