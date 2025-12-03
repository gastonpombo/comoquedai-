import Script from 'next/script'

export function StructuredData() {
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "ImageAI",
        "url": "https://shopshop.market",
        "logo": "https://shopshop.market/opengraph-image.png",
        "description": "Plataforma SaaS de generación de imágenes con Inteligencia Artificial para agencias de marketing",
        "foundingDate": "2024",
        "sameAs": [
            "https://twitter.com/imageai",
            "https://linkedin.com/company/imageai"
        ]
    }

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "ImageAI",
        "url": "https://shopshop.market",
        "description": "Generador de imágenes con IA para agencias de marketing digital",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://shopshop.market/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    }

    const softwareSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "ImageAI",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "offers": [
            {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "name": "Plan Gratis",
                "description": "10 créditos de regalo para comenzar"
            },
            {
                "@type": "Offer",
                "price": "19",
                "priceCurrency": "USD",
                "name": "Plan Básico",
                "description": "100 créditos para agencias pequeñas"
            },
            {
                "@type": "Offer",
                "price": "49",
                "priceCurrency": "USD",
                "name": "Plan Premium",
                "description": "500 créditos con soporte prioritario"
            },
            {
                "@type": "Offer",
                "price": "99",
                "priceCurrency": "USD",
                "name": "Plan Empresas",
                "description": "2000 créditos con API access"
            }
        ],
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "127",
            "bestRating": "5",
            "worstRating": "1"
        },
        "description": "Genera imágenes profesionales con Inteligencia Artificial en segundos. Plataforma SaaS para agencias de marketing.",
        "featureList": [
            "Generación instantánea de imágenes",
            "Seguridad empresarial",
            "Escalabilidad global",
            "API Access",
            "Soporte prioritario"
        ]
    }

    return (
        <>
            <Script
                id="organization-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <Script
                id="website-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
            <Script
                id="software-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
            />
        </>
    )
}
