from django import template

register = template.Library()


@register.simple_tag
def get_image_name(value):
    return str(value).split('/')[1].split('.')[0]