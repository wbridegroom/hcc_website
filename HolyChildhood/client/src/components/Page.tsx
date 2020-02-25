import React from 'react';

const Page: React.FC<{ id: string}> = ({id}) => {
    return (
        <div>
            Page {id}
        </div>
    )
};

export default Page;
