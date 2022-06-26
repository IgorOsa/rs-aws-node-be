-- Example data for filling DB
create extension
if not exists "uuid-ossp";

create table products
(
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    description text,
    price integer
)

create table stocks
(
    product_id uuid,
    count integer,
    foreign key(product_id) references products(id)
)

insert into products
    (title, description, price)
VALUES
    ('Windows 10 Home', 'License for Windows 10 Home', 149),
    ('Windows 10 Professional', 'License for Windows 10 Professional', 199),
    ('Windows 11 Home', 'License for Windows 11 Home', 199),
    ('Windows 11 Professional', 'License for Windows 11 Professional', 249),
    ('MS Office 2022 Home', 'Lifetime License for MS Office 2022 Home', 149),
    ('MS Office 2022 Professional', 'Lifetime License for MS Office 2022 Home', 249)

insert into stocks
    (product_id, count)
values
    ('ca4ddac4-4a43-452c-b64e-14345c6d602e', 3),
    ('5f36feb8-fedb-4f76-b50f-18808154fd75', 3),
    ('38ce2ae9-47b4-40be-b16d-2c4df0d15cd2', 3),
    ('2e88e625-450a-4d26-9659-4c86c9c974ef', 3),
    ('9e12e73e-9400-48b3-8ff9-ddb4cc049235', 3),
    ('1a2ef774-4bbc-44e9-9728-4b33ed925b23', 3)

