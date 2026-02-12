import { useState } from 'react';
import {
  LucideBookDashed,
  FileText,
  Code,
  File,
  Download,
  Plus,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardFooter } from '@components/base/card';
import { Button } from '@components/base/button';
import { Badge } from '@components/base/badge';
import { TextField } from '@components/base/text-field';
import PageHeader from '@components/PageHeader';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@components/base/dialog';

interface Template {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  fields: TemplateField[];
}

interface TemplateField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'textarea';
  placeholder: string;
  required?: boolean;
}

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  // TODO: Implement endpoint GET /api/templates
  const templates: Template[] = [
    {
      id: 1,
      name: 'Project README',
      description: 'Generate a comprehensive README.md for your project',
      icon: <FileText className='w-6 h-6' />,
      category: 'Documentation',
      fields: [
        {
          name: 'projectName',
          label: 'Project Name',
          type: 'text',
          placeholder: 'My Awesome Project',
          required: true,
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          placeholder: 'What does your project do?',
          required: true,
        },
        {
          name: 'author',
          label: 'Author',
          type: 'text',
          placeholder: 'Your name',
        },
      ],
    },
    {
      id: 2,
      name: 'React Component',
      description: 'Scaffold a new React component with TypeScript',
      icon: <Code className='w-6 h-6' />,
      category: 'Code',
      fields: [
        {
          name: 'componentName',
          label: 'Component Name',
          type: 'text',
          placeholder: 'MyComponent',
          required: true,
        },
        {
          name: 'props',
          label: 'Props (comma-separated)',
          type: 'text',
          placeholder: 'title, onClick, disabled',
        },
      ],
    },
    {
      id: 3,
      name: 'API Endpoint',
      description: 'Generate REST API endpoint boilerplate',
      icon: <Code className='w-6 h-6' />,
      category: 'Code',
      fields: [
        {
          name: 'route',
          label: 'Route Path',
          type: 'text',
          placeholder: '/api/users',
          required: true,
        },
        {
          name: 'method',
          label: 'HTTP Method',
          type: 'text',
          placeholder: 'GET, POST, PATCH, DELETE',
          required: true,
        },
      ],
    },
    {
      id: 4,
      name: 'License File',
      description: 'Generate a software license file',
      icon: <FileText className='w-6 h-6' />,
      category: 'Documentation',
      fields: [
        {
          name: 'licenseType',
          label: 'License Type',
          type: 'text',
          placeholder: 'MIT, Apache 2.0, GPL',
          required: true,
        },
        {
          name: 'year',
          label: 'Year',
          type: 'text',
          placeholder: '2024',
          required: true,
        },
        {
          name: 'author',
          label: 'Copyright Holder',
          type: 'text',
          placeholder: 'Your name or organization',
          required: true,
        },
      ],
    },
    {
      id: 5,
      name: 'Database Schema',
      description: 'Generate SQL database schema',
      icon: <Code className='w-6 h-6' />,
      category: 'Code',
      fields: [
        {
          name: 'tableName',
          label: 'Table Name',
          type: 'text',
          placeholder: 'users',
          required: true,
        },
        {
          name: 'columns',
          label: 'Columns (comma-separated)',
          type: 'textarea',
          placeholder: 'id, name, email, created_at',
          required: true,
        },
      ],
    },
    {
      id: 6,
      name: 'Configuration File',
      description: 'Generate configuration file template',
      icon: <File className='w-6 h-6' />,
      category: 'Configuration',
      fields: [
        {
          name: 'configType',
          label: 'Config Type',
          type: 'text',
          placeholder: 'TypeScript, ESLint, Prettier',
          required: true,
        },
      ],
    },
  ];

  const handleOpenTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setFormData({});
  };

  const categories = Array.from(new Set(templates.map((t) => t.category)));

  const filteredTemplates =
    activeCategory === 'ALL'
      ? templates
      : templates.filter((t) => t.category === activeCategory);

  const handleGenerate = () => {
    if (!selectedTemplate) return;
    console.log('Generating file from template:', {
      templateId: selectedTemplate.id,
      data: formData,
    });
    setSelectedTemplate(null);
    setFormData({});
  };

  return (
    <div className='space-y-4'>
      <PageHeader
        title='Templates'
        icon={<LucideBookDashed className='w-5 h-5' />}
      />

      <div className='flex flex-wrap gap-2'>
        <Badge
          className='cursor-pointer'
          variant={activeCategory === 'ALL' ? 'default' : 'secondary'}
          onClick={() => setActiveCategory('ALL')}
        >
          All
        </Badge>

        {categories.map((category) => (
          <Badge
            key={category}
            className='cursor-pointer'
            variant={activeCategory === category ? 'default' : 'secondary'}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Badge>
        ))}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onGenerate={() => handleOpenTemplate(template)}
          />
        ))}
      </div>

      {selectedTemplate && (
        <Dialog
          open={!!selectedTemplate}
          onOpenChange={() => setSelectedTemplate(null)}
        >
          <DialogContent className='max-w-2xl'>
            <DialogHeader>
              <DialogTitle className='flex items-center gap-2'>
                {selectedTemplate.icon}
                {selectedTemplate.name}
              </DialogTitle>
              <DialogDescription>
                {selectedTemplate.description}
              </DialogDescription>
            </DialogHeader>

            <div className='space-y-4 max-h-96 overflow-y-auto px-1 pb-1'>
              {selectedTemplate.fields.map((field) => (
                <div key={field.name}>
                  {field.type === 'textarea' ? (
                    <div>
                      <label className='text-sm text-muted-foreground mb-2 block'>
                        {field.label}
                        {field.required && (
                          <span className='text-destructive ml-1'>*</span>
                        )}
                      </label>
                      <textarea
                        placeholder={field.placeholder}
                        value={formData[field.name] || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [field.name]: e.target.value,
                          })
                        }
                        className='w-full min-h-24 px-3 py-2 bg-input border border-border rounded-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring'
                        required={field.required}
                      />
                    </div>
                  ) : (
                    <TextField
                      label={field.label}
                      placeholder={field.placeholder}
                      type={field.type}
                      value={formData[field.name] || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [field.name]: e.target.value,
                        })
                      }
                    />
                  )}
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => setSelectedTemplate(null)}
              >
                Cancel
              </Button>
              <Button onClick={handleGenerate}>
                <Download className='w-4 h-4' />
                Generate File
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
function TemplateCard({
  template,
  onGenerate,
}: {
  template: Template;
  onGenerate: () => void;
}) {
  return (
    <Card className='hover:border-primary/30 transition-all group'>
      <CardHeader>
        <div className='flex items-start gap-3'>
          <div className='p-3 bg-primary/10 rounded-sm text-primary group-hover:bg-primary/20 transition-colors'>
            {template.icon}
          </div>
          <div className='flex-1 min-w-0'>
            <CardTitle className='text-base mb-1'>{template.name}</CardTitle>
            <p className='text-sm text-muted-foreground line-clamp-2'>
              {template.description}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardFooter>
        <Badge variant='secondary' className='mr-auto'>
          {template.fields.length} field{template.fields.length !== 1 && 's'}
        </Badge>
        <Button onClick={onGenerate} size='sm'>
          <Plus className='w-4 h-4' />
          Generate
        </Button>
      </CardFooter>
    </Card>
  );
}
